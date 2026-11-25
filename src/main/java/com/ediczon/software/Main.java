package com.ediczon.software;

import com.ediczon.software.config.AppConfig;
import com.ediczon.software.db.Database;
import com.ediczon.software.db.Database.PortfolioProject;
import com.ediczon.software.db.Database.SavedImage;
import com.ediczon.software.db.Database.SolicitudRecord;
import com.ediczon.software.http.MultipartParser;
import com.ediczon.software.http.MultipartParser.FilePart;
import com.ediczon.software.http.MultipartParser.ParsedBody;
import com.ediczon.software.http.SolicitudRenderer;
import com.ediczon.software.nativebridge.CppImageBridge;
import com.ediczon.software.nativebridge.CppImageBridge.AnalysisResult;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;

/**
 * Punto de entrada del servidor HTTP en Java.
 * Integra SQLite, validacion binaria de imagenes en C++, portafolio real y redireccion a WhatsApp.
 */
public final class Main {
    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private static final DateTimeFormatter CODE_DATE = DateTimeFormatter.ofPattern("yyyyMMdd-HHmm");

    public static void main(String[] args) throws Exception {
        AppConfig cfg = AppConfig.load();
        Files.createDirectories(cfg.uploadDir);

        Database db = new Database(cfg.dbPath);
        CppImageBridge cpp = new CppImageBridge(cfg.cppBinary);

        HttpServer server = HttpServer.create(new InetSocketAddress(cfg.port), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

        server.createContext("/api/health", ex -> handleHealth(ex, cfg, db, cpp));
        server.createContext("/api/proyectos", ex -> handleProyectos(ex, db));
        server.createContext("/api/solicitudes", ex -> handleSolicitudes(ex, cfg, db, cpp));
        server.createContext("/api/imagenes/", ex -> handleGetImage(ex, cfg));
        server.createContext("/ver/", ex -> handleViewSolicitudHtml(ex, cfg, db));
        server.createContext("/", ex -> handleStatic(ex, cfg));

        server.start();
        System.out.println("Servidor iniciado en http://localhost:" + cfg.port);
        System.out.println("Base de datos SQLite: " + cfg.dbPath);
        System.out.println("Motor nativo C++ activo: " + cpp.isHealthy() + " (" + cfg.cppBinary + ")");
    }

    private static void handleHealth(HttpExchange ex, AppConfig cfg, Database db, CppImageBridge cpp) throws IOException {
        if (!"GET".equalsIgnoreCase(ex.getRequestMethod())) {
            sendJson(ex, 405, Map.of("error", "Metodo no permitido"));
            return;
        }
        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("ok", true);
            body.put("javaRuntime", System.getProperty("java.version"));
            body.put("cppAnalyzerReady", cpp.isHealthy());
            body.put("sqliteSolicitudes", db.countSolicitudes());
            body.put("whatsappDestino", cfg.whatsappDigits());
            sendJson(ex, 200, body);
        } catch (SQLException e) {
            sendJson(ex, 500, Map.of("ok", false, "error", e.getMessage()));
        }
    }

    private static void handleProyectos(HttpExchange ex, Database db) throws IOException {
        if (!"GET".equalsIgnoreCase(ex.getRequestMethod())) {
            sendJson(ex, 405, Map.of("error", "Metodo no permitido"));
            return;
        }
        try {
            List<PortfolioProject> proyectos = db.listPortfolioProjects();
            sendJson(ex, 200, Map.of("proyectos", proyectos));
        } catch (SQLException e) {
            sendJson(ex, 500, Map.of("error", "No se pudieron cargar los proyectos: " + e.getMessage()));
        }
    }

    private static void handleSolicitudes(HttpExchange ex, AppConfig cfg, Database db, CppImageBridge cpp) throws IOException {
        String path = ex.getRequestURI().getPath();
        String method = ex.getRequestMethod().toUpperCase(Locale.ROOT);

        if ("OPTIONS".equals(method)) {
            addCors(ex.getResponseHeaders());
            ex.sendResponseHeaders(204, -1);
            ex.close();
            return;
        }

        if ("GET".equals(method) && path.startsWith("/api/solicitudes/")) {
            String codigo = sanitizeToken(path.substring("/api/solicitudes/".length()));
            if (codigo.isEmpty()) {
                sendJson(ex, 400, Map.of("error", "Codigo invalido."));
                return;
            }
            try {
                SolicitudRecord rec = db.findSolicitudByCodigo(codigo);
                if (rec == null) {
                    sendJson(ex, 404, Map.of("error", "Solicitud no encontrada."));
                    return;
                }
                sendJson(ex, 200, rec);
            } catch (SQLException e) {
                sendJson(ex, 500, Map.of("error", e.getMessage()));
            }
            return;
        }

        if (!"POST".equals(method) || !"/api/solicitudes".equals(path)) {
            sendJson(ex, 405, Map.of("error", "Metodo o ruta no soportada."));
            return;
        }

        try {
            long maxTotal = (long) cfg.maxImagesPerRequest * cfg.maxImageBytes + (2L * 1024L * 1024L);
            byte[] rawBody = MultipartParser.readLimited(ex.getRequestBody(), maxTotal);
            String ctype = ex.getRequestHeaders().getFirst("Content-Type");
            ParsedBody form = MultipartParser.parse(ctype, rawBody);

            String nombre = form.firstField("clientName").trim();
            String rubro = form.firstField("businessSector").trim();
            String contacto = form.firstField("clientContact").trim();
            String plazo = form.firstField("timeline").trim();
            String descripcion = form.firstField("description").trim();
            List<String> tipos = form.allFields("projectType");
            List<String> funciones = form.allFields("features");
            List<String> imageNotes = form.allFields("imageNotes");

            if (nombre.isEmpty() || descripcion.isEmpty()) {
                sendJson(ex, 400, Map.of("error", "Completa tu nombre y describe que quieres que haga el software."));
                return;
            }
            if (form.files.size() > cfg.maxImagesPerRequest) {
                sendJson(ex, 400, Map.of("error", "Maximo " + cfg.maxImagesPerRequest + " imagenes por solicitud."));
                return;
            }

            String codigo = "SOL-" + LocalDateTime.now().format(CODE_DATE) + "-"
                + UUID.randomUUID().toString().substring(0, 4).toUpperCase(Locale.ROOT);
            Path reqDir = cfg.uploadDir.resolve(codigo);
            Files.createDirectories(reqDir);

            List<SavedImage> savedImages = new ArrayList<>();
            int idx = 0;
            for (FilePart part : form.files) {
                idx++;
                String ext = safeExtension(part.filename, part.contentType);
                String storedName = String.format("img_%02d%s", idx, ext);
                Path target = reqDir.resolve(storedName);
                Files.write(target, part.data);

                AnalysisResult analysis = cpp.analyze(target);
                if (!analysis.valid) {
                    deleteRecursively(reqDir);
                    sendJson(ex, 400, Map.of(
                        "error",
                        "Imagen '" + part.filename + "' rechazada por el validador C++: " + analysis.error
                    ));
                    return;
                }

                SavedImage img = new SavedImage();
                img.nombreOriginal = cleanFilename(part.filename);
                img.nombreArchivo = storedName;
                img.mimeType = mimeFromFormat(analysis.format);
                img.tamanoBytes = analysis.bytes;
                img.anchoPx = analysis.width;
                img.altoPx = analysis.height;
                img.checksumCpp = analysis.checksum;
                img.descripcionUsuario = (idx - 1 < imageNotes.size()) ? imageNotes.get(idx - 1).trim() : "";
                img.url = "/api/imagenes/" + codigo + "/" + storedName;
                savedImages.add(img);
            }

            String baseUrl = resolveBaseUrl(ex, cfg);
            String viewUrl = baseUrl + "/ver/" + codigo;

            SolicitudRecord rec = new SolicitudRecord();
            rec.codigo = codigo;
            rec.nombreCliente = nombre;
            rec.empresaRubro = rubro;
            rec.contactoCliente = contacto;
            rec.tiposProyecto = tipos;
            rec.funciones = funciones;
            rec.descripcion = descripcion;
            rec.plazo = plazo.isEmpty() ? "Por definir" : plazo;
            rec.mensajeWhatsapp = buildWhatsappMessage(rec, savedImages, viewUrl);

            long id = db.insertSolicitud(rec, savedImages);
            rec.id = id;
            rec.imagenes = savedImages;

            String waUrl = "https://wa.me/" + cfg.whatsappDigits() + "?text=" +
                URLEncoder.encode(rec.mensajeWhatsapp, StandardCharsets.UTF_8).replace("+", "%20");

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("ok", true);
            resp.put("id", id);
            resp.put("codigo", codigo);
            resp.put("viewUrl", viewUrl);
            resp.put("whatsappUrl", waUrl);
            resp.put("mensajeWhatsapp", rec.mensajeWhatsapp);
            resp.put("imagenes", savedImages);
            sendJson(ex, 201, resp);
        } catch (IOException | SQLException e) {
            sendJson(ex, 500, Map.of("error", "Error procesando solicitud: " + e.getMessage()));
        }
    }

    private static void handleGetImage(HttpExchange ex, AppConfig cfg) throws IOException {
        if (!"GET".equalsIgnoreCase(ex.getRequestMethod())) {
            sendText(ex, 405, "Metodo no permitido");
            return;
        }
        String rel = ex.getRequestURI().getPath().substring("/api/imagenes/".length());
        String[] parts = rel.split("/");
        if (parts.length != 2) {
            sendText(ex, 404, "Imagen no encontrada");
            return;
        }
        String codigo = sanitizeToken(parts[0]);
        String filename = sanitizeFilename(parts[1]);
        if (codigo.isEmpty() || filename.isEmpty()) {
            sendText(ex, 400, "Ruta invalida");
            return;
        }
        Path file = cfg.uploadDir.resolve(codigo).resolve(filename).normalize();
        if (!file.startsWith(cfg.uploadDir) || !Files.isRegularFile(file)) {
            sendText(ex, 404, "Imagen no encontrada");
            return;
        }
        byte[] bytes = Files.readAllBytes(file);
        ex.getResponseHeaders().set("Content-Type", guessMime(file));
        ex.getResponseHeaders().set("Cache-Control", "public, max-age=86400");
        ex.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void handleViewSolicitudHtml(HttpExchange ex, AppConfig cfg, Database db) throws IOException {
        if (!"GET".equalsIgnoreCase(ex.getRequestMethod())) {
            sendText(ex, 405, "Metodo no permitido");
            return;
        }
        String codigo = sanitizeToken(ex.getRequestURI().getPath().substring("/ver/".length()));
        if (codigo.isEmpty()) {
            sendText(ex, 400, "Codigo invalido");
            return;
        }
        try {
            SolicitudRecord rec = db.findSolicitudByCodigo(codigo);
            if (rec == null) {
                sendText(ex, 404, "Solicitud no encontrada");
                return;
            }
            byte[] html = SolicitudRenderer.renderHtml(rec, cfg.whatsappDigits()).getBytes(StandardCharsets.UTF_8);
            ex.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
            ex.sendResponseHeaders(200, html.length);
            try (OutputStream os = ex.getResponseBody()) {
                os.write(html);
            }
        } catch (SQLException e) {
            sendText(ex, 500, "Error de base de datos: " + e.getMessage());
        }
    }

    private static void handleStatic(HttpExchange ex, AppConfig cfg) throws IOException {
        if (!"GET".equalsIgnoreCase(ex.getRequestMethod()) && !"HEAD".equalsIgnoreCase(ex.getRequestMethod())) {
            sendText(ex, 405, "Metodo no permitido");
            return;
        }
        String rawPath = ex.getRequestURI().getPath();
        String decoded = URLDecoder.decode(rawPath, StandardCharsets.UTF_8);
        if (decoded.equals("/") || decoded.isEmpty()) {
            decoded = "/index.html";
        }
        boolean allowedPublic = decoded.equals("/index.html")
            || decoded.startsWith("/paginas/")
            || decoded.startsWith("/css/")
            || decoded.startsWith("/js/")
            || decoded.startsWith("/assets/");
        Path target = cfg.webRoot.resolve(decoded.substring(1)).normalize();
        if (!allowedPublic || !target.startsWith(cfg.webRoot) || !Files.isRegularFile(target)) {
            sendText(ex, 404, "Recurso no encontrado");
            return;
        }
        byte[] bytes = Files.readAllBytes(target);
        ex.getResponseHeaders().set("Content-Type", guessMime(target));
        if ("HEAD".equalsIgnoreCase(ex.getRequestMethod())) {
            ex.sendResponseHeaders(200, -1);
            ex.close();
            return;
        }
        ex.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String buildWhatsappMessage(SolicitudRecord rec, List<SavedImage> imgs, String viewUrl) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hola, quiero cotizar un proyecto de software (Codigo: ").append(rec.codigo).append(")\n\n");
        sb.append("*Cliente / Empresa:* ").append(rec.nombreCliente).append("\n");
        if (!rec.empresaRubro.isBlank()) {
            sb.append("*Rubro:* ").append(rec.empresaRubro).append("\n");
        }
        if (!rec.contactoCliente.isBlank()) {
            sb.append("*Contacto:* ").append(rec.contactoCliente).append("\n");
        }
        sb.append("*Tipo de solucion:* ")
          .append(rec.tiposProyecto.isEmpty() ? "Por definir" : String.join(", ", rec.tiposProyecto))
          .append("\n");
        if (!rec.funciones.isEmpty()) {
            sb.append("*Funciones:* ").append(String.join(", ", rec.funciones)).append("\n");
        }
        sb.append("*Plazo:* ").append(rec.plazo).append("\n\n");
        sb.append("*Que necesito que haga:*\n").append(rec.descripcion).append("\n");
        if (!imgs.isEmpty()) {
            sb.append("\n*Imagenes adjuntas (").append(imgs.size()).append("):*\n");
            for (int i = 0; i < imgs.size(); i++) {
                SavedImage im = imgs.get(i);
                sb.append(i + 1).append(") ").append(im.nombreOriginal)
                  .append(" (").append(im.anchoPx).append("x").append(im.altoPx).append(")");
                if (!im.descripcionUsuario.isBlank()) {
                    sb.append(" - ").append(im.descripcionUsuario);
                }
                sb.append("\n");
            }
            sb.append("\nVer solicitud e imagenes guardadas:\n").append(viewUrl).append("\n");
        } else {
            sb.append("\nVer ficha registrada:\n").append(viewUrl).append("\n");
        }
        return sb.toString();
    }

    private static String resolveBaseUrl(HttpExchange ex, AppConfig cfg) {
        if (!cfg.publicBaseUrl.isBlank()) {
            return cfg.publicBaseUrl.replaceAll("/+$", "");
        }
        String host = ex.getRequestHeaders().getFirst("Host");
        String proto = ex.getRequestHeaders().getFirst("X-Forwarded-Proto");
        if (proto == null || proto.isBlank()) proto = "http";
        if (host == null || host.isBlank()) return "http://localhost:" + cfg.port;
        return proto + "://" + host;
    }

    private static void sendJson(HttpExchange ex, int status, Object obj) throws IOException {
        byte[] data = GSON.toJson(obj).getBytes(StandardCharsets.UTF_8);
        Headers h = ex.getResponseHeaders();
        addCors(h);
        h.set("Content-Type", "application/json; charset=UTF-8");
        ex.sendResponseHeaders(status, data.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(data);
        }
    }

    private static void sendText(HttpExchange ex, int status, String text) throws IOException {
        byte[] data = text.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "text/plain; charset=UTF-8");
        ex.sendResponseHeaders(status, data.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(data);
        }
    }

    private static void addCors(Headers h) {
        h.set("Access-Control-Allow-Origin", "*");
        h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        h.set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static String sanitizeToken(String s) {
        if (s == null) return "";
        return s.replaceAll("[^A-Za-z0-9_-]", "");
    }

    private static String sanitizeFilename(String s) {
        if (s == null) return "";
        return s.replaceAll("[^A-Za-z0-9._-]", "");
    }

    private static String cleanFilename(String s) {
        if (s == null || s.isBlank()) return "imagen";
        String base = s.replace("\\", "/");
        int idx = base.lastIndexOf('/');
        return idx >= 0 ? base.substring(idx + 1) : base;
    }

    private static String safeExtension(String filename, String contentType) {
        String lower = filename == null ? "" : filename.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".png") || "image/png".equalsIgnoreCase(contentType)) return ".png";
        if (lower.endsWith(".webp") || "image/webp".equalsIgnoreCase(contentType)) return ".webp";
        if (lower.endsWith(".gif") || "image/gif".equalsIgnoreCase(contentType)) return ".gif";
        return ".jpg";
    }

    private static String mimeFromFormat(String fmt) {
        if ("PNG".equalsIgnoreCase(fmt)) return "image/png";
        if ("WEBP".equalsIgnoreCase(fmt)) return "image/webp";
        if ("GIF".equalsIgnoreCase(fmt)) return "image/gif";
        return "image/jpeg";
    }

    private static String guessMime(Path file) {
        String name = file.getFileName().toString().toLowerCase(Locale.ROOT);
        if (name.endsWith(".html")) return "text/html; charset=UTF-8";
        if (name.endsWith(".css")) return "text/css; charset=UTF-8";
        if (name.endsWith(".js")) return "application/javascript; charset=UTF-8";
        if (name.endsWith(".json")) return "application/json; charset=UTF-8";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".webp")) return "image/webp";
        if (name.endsWith(".gif")) return "image/gif";
        if (name.endsWith(".svg")) return "image/svg+xml";
        if (name.endsWith(".zip")) return "application/zip";
        return "application/octet-stream";
    }

    private static void deleteRecursively(Path dir) throws IOException {
        if (!Files.exists(dir)) return;
        try (var stream = Files.walk(dir)) {
            stream.sorted((a, b) -> b.compareTo(a)).forEach(p -> {
                try {
                    Files.deleteIfExists(p);
                } catch (IOException ignored) {}
            });
        }
    }
}
