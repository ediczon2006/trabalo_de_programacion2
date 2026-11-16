package com.ediczon.software.http;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Parser multipart/form-data en Java puro para procesar campos de texto y multiples archivos binarios.
 */
public final class MultipartParser {
    private static final Pattern NAME_PATTERN = Pattern.compile("name=\"([^\"]+)\"");
    private static final Pattern FILENAME_PATTERN = Pattern.compile("filename=\"([^\"]*)\"");

    public static final class TextField {
        public final String name;
        public final String value;

        public TextField(String name, String value) {
            this.name = name;
            this.value = value;
        }
    }

    public static final class FilePart {
        public final String fieldName;
        public final String filename;
        public final String contentType;
        public final byte[] data;

        public FilePart(String fieldName, String filename, String contentType, byte[] data) {
            this.fieldName = fieldName;
            this.filename = filename;
            this.contentType = contentType;
            this.data = data;
        }
    }

    public static final class ParsedBody {
        public final List<TextField> fields = new ArrayList<>();
        public final List<FilePart> files = new ArrayList<>();

        public String firstField(String name) {
            for (TextField f : fields) {
                if (f.name.equals(name)) return f.value;
            }
            return "";
        }

        public List<String> allFields(String name) {
            List<String> out = new ArrayList<>();
            for (TextField f : fields) {
                if (f.name.equals(name) && !f.value.isBlank()) out.add(f.value);
            }
            return out;
        }
    }

    private MultipartParser() {}

    public static ParsedBody parse(String contentTypeHeader, byte[] body) throws IOException {
        if (contentTypeHeader == null || !contentTypeHeader.contains("boundary=")) {
            throw new IOException("Encabezado Content-Type multipart invalido.");
        }
        String boundaryVal = extractBoundary(contentTypeHeader);
        byte[] boundaryBytes = ("--" + boundaryVal).getBytes(StandardCharsets.ISO_8859_1);
        ParsedBody parsed = new ParsedBody();

        int pos = indexOf(body, boundaryBytes, 0);
        if (pos < 0) return parsed;

        while (pos >= 0) {
            int partStart = pos + boundaryBytes.length;
            if (partStart + 2 <= body.length && body[partStart] == '-' && body[partStart + 1] == '-') {
                break; // fin del cuerpo multipart
            }
            if (partStart + 2 <= body.length && body[partStart] == '\r' && body[partStart + 1] == '\n') {
                partStart += 2;
            }
            int nextBoundary = indexOf(body, boundaryBytes, partStart);
            if (nextBoundary < 0) break;

            int partEnd = nextBoundary;
            if (partEnd >= 2 && body[partEnd - 2] == '\r' && body[partEnd - 1] == '\n') {
                partEnd -= 2;
            }

            byte[] headerSep = new byte[] {'\r', '\n', '\r', '\n'};
            int sepIdx = indexOf(body, headerSep, partStart, partEnd);
            if (sepIdx >= 0) {
                String headersText = new String(body, partStart, sepIdx - partStart, StandardCharsets.UTF_8);
                int dataStart = sepIdx + 4;
                byte[] partData = Arrays.copyOfRange(body, dataStart, partEnd);
                handlePart(headersText, partData, parsed);
            }
            pos = nextBoundary;
        }
        return parsed;
    }

    private static void handlePart(String headersText, byte[] data, ParsedBody parsed) {
        String name = null;
        String filename = null;
        String partContentType = "application/octet-stream";

        for (String line : headersText.split("\r\n")) {
            String lower = line.toLowerCase();
            if (lower.startsWith("content-disposition:")) {
                Matcher mn = NAME_PATTERN.matcher(line);
                if (mn.find()) name = mn.group(1);
                Matcher mf = FILENAME_PATTERN.matcher(line);
                if (mf.find()) filename = mf.group(1);
            } else if (lower.startsWith("content-type:")) {
                partContentType = line.substring(line.indexOf(':') + 1).trim();
            }
        }
        if (name == null) return;

        if (filename != null) {
            if (data.length > 0) {
                parsed.files.add(new FilePart(name, filename, partContentType, data));
            }
        } else {
            parsed.fields.add(new TextField(name, new String(data, StandardCharsets.UTF_8)));
        }
    }

    private static String extractBoundary(String contentType) throws IOException {
        for (String part : contentType.split(";")) {
            String trimmed = part.trim();
            if (trimmed.toLowerCase().startsWith("boundary=")) {
                String b = trimmed.substring(9).trim();
                if (b.startsWith("\"") && b.endsWith("\"") && b.length() >= 2) {
                    b = b.substring(1, b.length() - 1);
                }
                return b;
            }
        }
        throw new IOException("No se encontro boundary en multipart/form-data.");
    }

    private static int indexOf(byte[] haystack, byte[] needle, int from) {
        return indexOf(haystack, needle, from, haystack.length);
    }

    private static int indexOf(byte[] haystack, byte[] needle, int from, int limit) {
        int max = limit - needle.length;
        for (int i = from; i <= max; i++) {
            boolean match = true;
            for (int j = 0; j < needle.length; j++) {
                if (haystack[i + j] != needle[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return i;
        }
        return -1;
    }

    public static byte[] readLimited(java.io.InputStream in, long maxTotalBytes) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[16384];
        long total = 0;
        int n;
        while ((n = in.read(buf)) != -1) {
            total += n;
            if (total > maxTotalBytes) {
                throw new IOException("La carga supera el limite permitido (" + (maxTotalBytes / (1024 * 1024)) + " MB).");
            }
            out.write(buf, 0, n);
        }
        return out.toByteArray();
    }
}
