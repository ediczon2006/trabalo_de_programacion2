package com.ediczon.software.config;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Configuracion central de la aplicacion web, base de datos SQLite,
 * binario nativo C++ y redireccion a WhatsApp.
 */
public final class AppConfig {
    public final int port;
    public final Path webRoot;
    public final Path dbPath;
    public final Path uploadDir;
    public final Path cppBinary;
    public final String whatsappCountryCode;
    public final String whatsappNumber;
    public final String publicBaseUrl;
    public final int maxImagesPerRequest;
    public final long maxImageBytes;

    private AppConfig(
        int port,
        Path webRoot,
        Path dbPath,
        Path uploadDir,
        Path cppBinary,
        String whatsappCountryCode,
        String whatsappNumber,
        String publicBaseUrl,
        int maxImagesPerRequest,
        long maxImageBytes
    ) {
        this.port = port;
        this.webRoot = webRoot;
        this.dbPath = dbPath;
        this.uploadDir = uploadDir;
        this.cppBinary = cppBinary;
        this.whatsappCountryCode = whatsappCountryCode;
        this.whatsappNumber = whatsappNumber;
        this.publicBaseUrl = publicBaseUrl;
        this.maxImagesPerRequest = maxImagesPerRequest;
        this.maxImageBytes = maxImageBytes;
    }

    public static AppConfig load() {
        int port = parseIntOrDefault(System.getenv("PORT"), 8080);
        Path webRoot = Paths.get(envOrDefault("WEB_ROOT", "web")).toAbsolutePath().normalize();
        Path dbPath = Paths.get(envOrDefault("DB_PATH", "data/solicitudes.db")).toAbsolutePath().normalize();
        Path uploadDir = Paths.get(envOrDefault("UPLOAD_DIR", "data/uploads")).toAbsolutePath().normalize();

        String defaultCpp = isWindows() ? "native/bin/image_analyzer.exe" : "native/bin/image_analyzer";
        Path cppBinary = Paths.get(envOrDefault("CPP_ANALYZER_BIN", defaultCpp)).toAbsolutePath().normalize();

        String waCode = envOrDefault("WHATSAPP_COUNTRY_CODE", "51");
        String waNum = envOrDefault("WHATSAPP_NUMBER", "914662798");
        String baseUrl = envOrDefault("PUBLIC_BASE_URL", "");
        return new AppConfig(
            port, webRoot, dbPath, uploadDir, cppBinary,
            waCode, waNum, baseUrl,
            8, 12L * 1024L * 1024L
        );
    }

    public String whatsappDigits() {
        return whatsappCountryCode + whatsappNumber;
    }

    private static String envOrDefault(String key, String fallback) {
        String val = System.getenv(key);
        return (val == null || val.isBlank()) ? fallback : val.trim();
    }

    private static int parseIntOrDefault(String val, int fallback) {
        if (val == null || val.isBlank()) return fallback;
        try {
            return Integer.parseInt(val.trim());
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }

    private static boolean isWindows() {
        String os = System.getProperty("os.name", "");
        return os.toLowerCase().contains("win");
    }
}
