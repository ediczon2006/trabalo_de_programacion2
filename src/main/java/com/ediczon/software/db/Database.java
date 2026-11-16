package com.ediczon.software.db;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Capa de persistencia en SQLite para proyectos de portafolio,
 * solicitudes de software e imagenes de referencia.
 */
public final class Database {
    private static final Gson GSON = new Gson();
    private static final Type STRING_LIST_TYPE = new TypeToken<List<String>>() {}.getType();
    private final String jdbcUrl;

    public Database(Path dbPath) throws IOException, SQLException {
        Path parent = dbPath.getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
        this.jdbcUrl = "jdbc:sqlite:" + dbPath.toAbsolutePath();
        initSchemaAndSeed();
    }

    public static final class PortfolioProject {
        public long id;
        public String slug;
        public String nombre;
        public String tipo;
        public String descripcion;
        public String urlPublica;
        public String imagenPrincipal;
        public List<String> galeria = new ArrayList<>();
        public List<String> aspectos = new ArrayList<>();
    }

    public static final class SavedImage {
        public long id;
        public String nombreOriginal;
        public String nombreArchivo;
        public String mimeType;
        public long tamanoBytes;
        public int anchoPx;
        public int altoPx;
        public String checksumCpp;
        public String descripcionUsuario;
        public String url;
    }

    public static final class SolicitudRecord {
        public long id;
        public String codigo;
        public String nombreCliente;
        public String empresaRubro;
        public String contactoCliente;
        public List<String> tiposProyecto = new ArrayList<>();
        public List<String> funciones = new ArrayList<>();
        public String descripcion;
        public String plazo;
        public String mensajeWhatsapp;
        public String createdAt;
        public List<SavedImage> imagenes = new ArrayList<>();
    }

    private Connection open() throws SQLException {
        Connection conn = DriverManager.getConnection(jdbcUrl);
        try (Statement st = conn.createStatement()) {
            st.execute("PRAGMA foreign_keys = ON;");
        }
        return conn;
    }

    private void initSchemaAndSeed() throws SQLException {
        try (Connection conn = open(); Statement st = conn.createStatement()) {
            st.execute("""
                CREATE TABLE IF NOT EXISTS proyectos_portafolio (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slug TEXT NOT NULL UNIQUE,
                    nombre TEXT NOT NULL,
                    tipo TEXT NOT NULL,
                    descripcion TEXT NOT NULL,
                    url_publica TEXT NOT NULL,
                    imagen_principal TEXT NOT NULL,
                    galeria_json TEXT NOT NULL,
                    aspectos_json TEXT NOT NULL,
                    orden INTEGER NOT NULL DEFAULT 0
                );
            """);

            st.execute("""
                CREATE TABLE IF NOT EXISTS solicitudes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    codigo TEXT NOT NULL UNIQUE,
                    nombre_cliente TEXT NOT NULL,
                    empresa_rubro TEXT NOT NULL,
                    contacto_cliente TEXT NOT NULL,
                    tipos_json TEXT NOT NULL,
                    funciones_json TEXT NOT NULL,
                    descripcion TEXT NOT NULL,
                    plazo TEXT NOT NULL,
                    mensaje_whatsapp TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
                );
            """);

            st.execute("""
                CREATE TABLE IF NOT EXISTS imagenes_referencia (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    solicitud_id INTEGER NOT NULL,
                    nombre_original TEXT NOT NULL,
                    nombre_archivo TEXT NOT NULL,
                    mime_type TEXT NOT NULL,
                    tamano_bytes INTEGER NOT NULL,
                    ancho_px INTEGER NOT NULL,
                    alto_px INTEGER NOT NULL,
                    checksum_cpp TEXT NOT NULL,
                    descripcion_usuario TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
                    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
                );
            """);

            seedPortfolioIfEmpty(conn);
        }
    }

    private void seedPortfolioIfEmpty(Connection conn) throws SQLException {
        try (Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM proyectos_portafolio")) {
            if (rs.next() && rs.getInt(1) > 0) {
                return;
            }
        }

        // Solo los 5 proyectos reales verificados; sin agregar C++ ni Java como items de portafolio.
        List<PortfolioProject> defaults = List.of(
            makeProject(
                "01_Pelitos_Web",
                "Pelitos Veterinaria",
                "Sitio web comercial y catálogo en línea",
                "Sitio web informativo y comercial de clínica veterinaria, estética canina y petshop en Huánuco, con reserva rápida de citas, directorio de servicios y catálogo de productos.",
                "https://ediczon2006.github.io/Pelitos_Veterinarias/",
                "assets/portafolio/01_Pelitos_Web/capturas_limpias/01_inicio_escritorio.png",
                List.of(
                    "assets/portafolio/01_Pelitos_Web/capturas_limpias/01_inicio_escritorio.png",
                    "assets/portafolio/01_Pelitos_Web/capturas_limpias/02_catalogo_petshop.png",
                    "assets/portafolio/01_Pelitos_Web/capturas_limpias/03_servicios_veterinarios.png",
                    "assets/portafolio/01_Pelitos_Web/capturas_limpias/04_vista_movil.png"
                ),
                List.of(
                    "Selector rápido de reserva de cita en portada",
                    "Catálogo PetShop con buscador, conteo y filtros",
                    "Directorio de servicios médicos con detalle desplegable"
                )
            ),
            makeProject(
                "02_Pelitos_Administracion",
                "Pelitos Docs",
                "Aplicación web de gestión documental",
                "Biblioteca y explorador empresarial de documentos organizado por unidades de negocio y servicios compartidos, con búsqueda, filtros por formato, carga de archivos e inspector visual.",
                "https://ediczon2006.github.io/-administracion_de_clientes_pelitos_veterinaria/",
                "assets/portafolio/02_Pelitos_Administracion/capturas_limpias/01_inicio_escritorio.png",
                List.of(
                    "assets/portafolio/02_Pelitos_Administracion/capturas_limpias/01_inicio_escritorio.png",
                    "assets/portafolio/02_Pelitos_Administracion/capturas_limpias/02_explorador_documental.png"
                ),
                List.of(
                    "Organización por unidades de negocio y servicios compartidos",
                    "Buscador por nombre y filtro por formato de documento",
                    "Explorador con árbol de directorios e inspector lateral"
                )
            ),
            makeProject(
                "03_Ferreteria_Sullcairi",
                "Ferretería Sullcairi PRO POS",
                "Sistema web de inventario y reportes comerciales",
                "Sistema de control de stock y caja en modo local con indicadores de inventario, importación y exportación en Excel, alertas de reposición y resumen comercial de ventas.",
                "https://ediczon2006.github.io/ferreteria_sullcairi/",
                "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/01_inventario_y_stock.png",
                List.of(
                    "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/01_inventario_y_stock.png",
                    "assets/portafolio/03_Ferreteria_Sullcairi/capturas_limpias/02_resumen_de_ventas.png"
                ),
                List.of(
                    "Control de inventario con filtros por categoría y stock",
                    "Plantilla, importación y exportación de catálogo a Excel",
                    "Resumen comercial con ingresos, ganancia neta e historial"
                )
            ),
            makeProject(
                "04_Sullcairi",
                "Estación de Servicios Sullcairi",
                "Portal de acceso de sistema operativo",
                "Portal de autenticación para estación de servicios con selector visual por perfil/turno y teclado numérico táctil para ingreso seguro mediante código PIN.",
                "https://ediczon2006.github.io/sullcairi/login.html",
                "assets/portafolio/04_Sullcairi/capturas_limpias/01_login_escritorio.png",
                List.of(
                    "assets/portafolio/04_Sullcairi/capturas_limpias/01_login_escritorio.png",
                    "assets/portafolio/04_Sullcairi/capturas_limpias/02_login_movil.png"
                ),
                List.of(
                    "Selector de perfiles de administrador y turnos de atención",
                    "Teclado numérico en pantalla para código PIN",
                    "Interfaz centrada adaptable en escritorio y móvil"
                )
            ),
            makeProject(
                "05_Leyder",
                "Leytrix ISP",
                "Panel administrativo para proveedor de internet",
                "Panel de control para gestión de clientes de internet por zonas geográficas, registro de pagos y vouchers bancarios, cortes y reconexiones, y galería fotográfica.",
                "https://ediczon2006.github.io/leyder/",
                "assets/portafolio/05_Leyder/capturas_limpias/01_panel_de_control.png",
                List.of(
                    "assets/portafolio/05_Leyder/capturas_limpias/01_panel_de_control.png",
                    "assets/portafolio/05_Leyder/capturas_limpias/02_cortes_y_reconexion.png",
                    "assets/portafolio/05_Leyder/capturas_limpias/03_pagos_y_vouchers.png",
                    "assets/portafolio/05_Leyder/capturas_limpias/04_vista_movil.png"
                ),
                List.of(
                    "Panel de control con métricas de red y tabla por zonas",
                    "Gestión de cortes, reconexiones y morosidad",
                    "Registro de pagos y comprobantes Yape / BCP"
                )
            )
        );

        String sql = """
            INSERT INTO proyectos_portafolio
            (slug, nombre, tipo, descripcion, url_publica, imagen_principal, galeria_json, aspectos_json, orden)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            int idx = 1;
            for (PortfolioProject p : defaults) {
                ps.setString(1, p.slug);
                ps.setString(2, p.nombre);
                ps.setString(3, p.tipo);
                ps.setString(4, p.descripcion);
                ps.setString(5, p.urlPublica);
                ps.setString(6, p.imagenPrincipal);
                ps.setString(7, GSON.toJson(p.galeria));
                ps.setString(8, GSON.toJson(p.aspectos));
                ps.setInt(9, idx++);
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    private static PortfolioProject makeProject(
        String slug, String nombre, String tipo, String descripcion,
        String urlPublica, String imgPrincipal, List<String> galeria, List<String> aspectos
    ) {
        PortfolioProject p = new PortfolioProject();
        p.slug = slug;
        p.nombre = nombre;
        p.tipo = tipo;
        p.descripcion = descripcion;
        p.urlPublica = urlPublica;
        p.imagenPrincipal = imgPrincipal;
        p.galeria = galeria;
        p.aspectos = aspectos;
        return p;
    }

    public List<PortfolioProject> listPortfolioProjects() throws SQLException {
        String sql = "SELECT id, slug, nombre, tipo, descripcion, url_publica, imagen_principal, galeria_json, aspectos_json FROM proyectos_portafolio ORDER BY orden ASC";
        List<PortfolioProject> list = new ArrayList<>();
        try (Connection conn = open(); Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                PortfolioProject p = new PortfolioProject();
                p.id = rs.getLong("id");
                p.slug = rs.getString("slug");
                p.nombre = rs.getString("nombre");
                p.tipo = rs.getString("tipo");
                p.descripcion = rs.getString("descripcion");
                p.urlPublica = rs.getString("url_publica");
                p.imagenPrincipal = rs.getString("imagen_principal");
                p.galeria = GSON.fromJson(rs.getString("galeria_json"), STRING_LIST_TYPE);
                p.aspectos = GSON.fromJson(rs.getString("aspectos_json"), STRING_LIST_TYPE);
                list.add(p);
            }
        }
        return list;
    }

    public long insertSolicitud(SolicitudRecord rec, List<SavedImage> images) throws SQLException {
        try (Connection conn = open()) {
            conn.setAutoCommit(false);
            try {
                String sqlSol = """
                    INSERT INTO solicitudes
                    (codigo, nombre_cliente, empresa_rubro, contacto_cliente, tipos_json, funciones_json, descripcion, plazo, mensaje_whatsapp)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
                long solicitudId;
                try (PreparedStatement ps = conn.prepareStatement(sqlSol, Statement.RETURN_GENERATED_KEYS)) {
                    ps.setString(1, rec.codigo);
                    ps.setString(2, rec.nombreCliente);
                    ps.setString(3, rec.empresaRubro);
                    ps.setString(4, rec.contactoCliente);
                    ps.setString(5, GSON.toJson(rec.tiposProyecto));
                    ps.setString(6, GSON.toJson(rec.funciones));
                    ps.setString(7, rec.descripcion);
                    ps.setString(8, rec.plazo);
                    ps.setString(9, rec.mensajeWhatsapp);
                    ps.executeUpdate();
                    try (ResultSet keys = ps.getGeneratedKeys()) {
                        if (!keys.next()) throw new SQLException("No se obtuvo ID de solicitud.");
                        solicitudId = keys.getLong(1);
                    }
                }

                String sqlImg = """
                    INSERT INTO imagenes_referencia
                    (solicitud_id, nombre_original, nombre_archivo, mime_type, tamano_bytes, ancho_px, alto_px, checksum_cpp, descripcion_usuario)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
                try (PreparedStatement psImg = conn.prepareStatement(sqlImg, Statement.RETURN_GENERATED_KEYS)) {
                    for (SavedImage img : images) {
                        psImg.setLong(1, solicitudId);
                        psImg.setString(2, img.nombreOriginal);
                        psImg.setString(3, img.nombreArchivo);
                        psImg.setString(4, img.mimeType);
                        psImg.setLong(5, img.tamanoBytes);
                        psImg.setInt(6, img.anchoPx);
                        psImg.setInt(7, img.altoPx);
                        psImg.setString(8, img.checksumCpp);
                        psImg.setString(9, img.descripcionUsuario == null ? "" : img.descripcionUsuario);
                        psImg.executeUpdate();
                        try (ResultSet ik = psImg.getGeneratedKeys()) {
                            if (ik.next()) img.id = ik.getLong(1);
                        }
                    }
                }
                conn.commit();
                return solicitudId;
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        }
    }

    public SolicitudRecord findSolicitudByCodigo(String codigo) throws SQLException {
        String sql = "SELECT id, codigo, nombre_cliente, empresa_rubro, contacto_cliente, tipos_json, funciones_json, descripcion, plazo, mensaje_whatsapp, created_at FROM solicitudes WHERE codigo = ?";
        try (Connection conn = open(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, codigo);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return null;
                SolicitudRecord rec = new SolicitudRecord();
                rec.id = rs.getLong("id");
                rec.codigo = rs.getString("codigo");
                rec.nombreCliente = rs.getString("nombre_cliente");
                rec.empresaRubro = rs.getString("empresa_rubro");
                rec.contactoCliente = rs.getString("contacto_cliente");
                rec.tiposProyecto = GSON.fromJson(rs.getString("tipos_json"), STRING_LIST_TYPE);
                rec.funciones = GSON.fromJson(rs.getString("funciones_json"), STRING_LIST_TYPE);
                rec.descripcion = rs.getString("descripcion");
                rec.plazo = rs.getString("plazo");
                rec.mensajeWhatsapp = rs.getString("mensaje_whatsapp");
                rec.createdAt = rs.getString("created_at");

                String sqlImgs = "SELECT id, nombre_original, nombre_archivo, mime_type, tamano_bytes, ancho_px, alto_px, checksum_cpp, descripcion_usuario FROM imagenes_referencia WHERE solicitud_id = ? ORDER BY id ASC";
                try (PreparedStatement psI = conn.prepareStatement(sqlImgs)) {
                    psI.setLong(1, rec.id);
                    try (ResultSet ri = psI.executeQuery()) {
                        while (ri.next()) {
                            SavedImage im = new SavedImage();
                            im.id = ri.getLong("id");
                            im.nombreOriginal = ri.getString("nombre_original");
                            im.nombreArchivo = ri.getString("nombre_archivo");
                            im.mimeType = ri.getString("mime_type");
                            im.tamanoBytes = ri.getLong("tamano_bytes");
                            im.anchoPx = ri.getInt("ancho_px");
                            im.altoPx = ri.getInt("alto_px");
                            im.checksumCpp = ri.getString("checksum_cpp");
                            im.descripcionUsuario = ri.getString("descripcion_usuario");
                            im.url = "/api/imagenes/" + rec.codigo + "/" + im.nombreArchivo;
                            rec.imagenes.add(im);
                        }
                    }
                }
                return rec;
            }
        }
    }

    public int countSolicitudes() throws SQLException {
        try (Connection conn = open(); Statement st = conn.createStatement(); ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM solicitudes")) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }
}
