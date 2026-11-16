package com.ediczon.software.nativebridge;

import com.google.gson.Gson;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

/**
 * Puente nativo hacia el analizador de imagenes compilado en C++.
 * Valida magic bytes reales, dimensiones y checksum antes de registrar en SQLite.
 */
public final class CppImageBridge {
    private static final Gson GSON = new Gson();
    private final Path binaryPath;

    public CppImageBridge(Path binaryPath) {
        this.binaryPath = binaryPath;
    }

    public static final class AnalysisResult {
        public boolean valid;
        public String format;
        public int width;
        public int height;
        public long bytes;
        public String checksum;
        public String error;
    }

    public boolean isHealthy() {
        if (!Files.isRegularFile(binaryPath)) {
            return false;
        }
        try {
            Process p = new ProcessBuilder(binaryPath.toString(), "--health")
                .redirectErrorStream(true)
                .start();
            boolean finished = p.waitFor(5, TimeUnit.SECONDS);
            return finished && p.exitValue() == 0;
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) Thread.currentThread().interrupt();
            return false;
        }
    }

    public AnalysisResult analyze(Path imageFile) throws IOException {
        if (!Files.isRegularFile(binaryPath)) {
            throw new IOException("Binario nativo C++ no encontrado en: " + binaryPath);
        }
        Process process = new ProcessBuilder(binaryPath.toString(), imageFile.toAbsolutePath().toString())
            .redirectErrorStream(true)
            .start();

        byte[] outBytes = process.getInputStream().readAllBytes();
        try {
            if (!process.waitFor(10, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                throw new IOException("Tiempo de espera agotado en analizador C++.");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Analisis de imagen interrumpido.", e);
        }

        String rawJson = new String(outBytes, StandardCharsets.UTF_8).trim();
        AnalysisResult parsed = GSON.fromJson(rawJson, AnalysisResult.class);
        if (parsed == null) {
            AnalysisResult err = new AnalysisResult();
            err.valid = false;
            err.error = "Respuesta vacia del procesador C++.";
            return err;
        }
        return parsed;
    }
}
