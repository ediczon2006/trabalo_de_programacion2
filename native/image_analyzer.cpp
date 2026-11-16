#include <cstdint>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

namespace fs = std::filesystem;

struct ImageInfo {
    bool valid = false;
    std::string format = "UNKNOWN";
    uint32_t width = 0;
    uint32_t height = 0;
    uint64_t bytes = 0;
    std::string checksum;
    std::string error;
};

static uint32_t read_be32(const std::vector<uint8_t>& buf, size_t off) {
    return (static_cast<uint32_t>(buf[off]) << 24) |
           (static_cast<uint32_t>(buf[off + 1]) << 16) |
           (static_cast<uint32_t>(buf[off + 2]) << 8) |
           static_cast<uint32_t>(buf[off + 3]);
}

static uint16_t read_be16(const std::vector<uint8_t>& buf, size_t off) {
    return (static_cast<uint16_t>(buf[off]) << 8) |
           static_cast<uint16_t>(buf[off + 1]);
}

static uint16_t read_le16(const std::vector<uint8_t>& buf, size_t off) {
    return static_cast<uint16_t>(buf[off]) |
           (static_cast<uint16_t>(buf[off + 1]) << 8);
}

static uint32_t read_le24(const std::vector<uint8_t>& buf, size_t off) {
    return static_cast<uint32_t>(buf[off]) |
           (static_cast<uint32_t>(buf[off + 1]) << 8) |
           (static_cast<uint32_t>(buf[off + 2]) << 16);
}

static std::string compute_fnv1a64(const std::vector<uint8_t>& data) {
    uint64_t hash = 14695981039346656037ULL;
    for (uint8_t b : data) {
        hash ^= b;
        hash *= 1099511628211ULL;
    }
    std::ostringstream oss;
    oss << std::hex << std::setw(16) << std::setfill('0') << hash;
    return oss.str();
}

static bool parse_png(const std::vector<uint8_t>& b, ImageInfo& out) {
    if (b.size() < 24) return false;
    const uint8_t sig[8] = {0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
    for (int i = 0; i < 8; ++i) {
        if (b[i] != sig[i]) return false;
    }
    if (b[12] == 'I' && b[13] == 'H' && b[14] == 'D' && b[15] == 'R') {
        out.width = read_be32(b, 16);
        out.height = read_be32(b, 20);
        out.format = "PNG";
        return out.width > 0 && out.height > 0;
    }
    return false;
}

static bool parse_gif(const std::vector<uint8_t>& b, ImageInfo& out) {
    if (b.size() < 10) return false;
    if (b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8' &&
        (b[4] == '7' || b[4] == '9') && b[5] == 'a') {
        out.width = read_le16(b, 6);
        out.height = read_le16(b, 8);
        out.format = "GIF";
        return out.width > 0 && out.height > 0;
    }
    return false;
}

static bool parse_jpeg(const std::vector<uint8_t>& b, ImageInfo& out) {
    if (b.size() < 4 || b[0] != 0xFF || b[1] != 0xD8) return false;
    size_t pos = 2;
    while (pos + 4 <= b.size()) {
        if (b[pos] != 0xFF) {
            ++pos;
            continue;
        }
        while (pos < b.size() && b[pos] == 0xFF) ++pos;
        if (pos >= b.size()) break;
        uint8_t marker = b[pos++];
        if (marker == 0xD8 || marker == 0xD9 || marker == 0x01 || (marker >= 0xD0 && marker <= 0xD7)) {
            continue;
        }
        if (pos + 2 > b.size()) break;
        uint16_t seg_len = read_be16(b, pos);
        if (seg_len < 2 || pos + seg_len > b.size()) break;

        bool is_sof = (marker >= 0xC0 && marker <= 0xC3) ||
                      (marker >= 0xC5 && marker <= 0xC7) ||
                      (marker >= 0xC9 && marker <= 0xCB) ||
                      (marker >= 0xCD && marker <= 0xCF);
        if (is_sof && seg_len >= 7) {
            out.height = read_be16(b, pos + 3);
            out.width = read_be16(b, pos + 5);
            out.format = "JPEG";
            return out.width > 0 && out.height > 0;
        }
        pos += seg_len;
    }
    return false;
}

static bool parse_webp(const std::vector<uint8_t>& b, ImageInfo& out) {
    if (b.size() < 30) return false;
    if (!(b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F' &&
          b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P')) {
        return false;
    }
    if (b[12] == 'V' && b[13] == 'P' && b[14] == '8' && b[15] == ' ') {
        // Lossy VP8 bitstream header starts at offset 20 + 6 bytes frame tag
        if (b.size() >= 30 && b[23] == 0x9D && b[24] == 0x01 && b[25] == 0x2A) {
            out.width = read_le16(b, 26) & 0x3FFF;
            out.height = read_le16(b, 28) & 0x3FFF;
            out.format = "WEBP";
            return out.width > 0 && out.height > 0;
        }
    } else if (b[12] == 'V' && b[13] == 'P' && b[14] == '8' && b[15] == 'L') {
        if (b.size() >= 25 && b[20] == 0x2F) {
            uint32_t bits = static_cast<uint32_t>(b[21]) |
                            (static_cast<uint32_t>(b[22]) << 8) |
                            (static_cast<uint32_t>(b[23]) << 16) |
                            (static_cast<uint32_t>(b[24]) << 24);
            out.width = (bits & 0x3FFF) + 1;
            out.height = ((bits >> 14) & 0x3FFF) + 1;
            out.format = "WEBP";
            return out.width > 0 && out.height > 0;
        }
    } else if (b[12] == 'V' && b[13] == 'P' && b[14] == '8' && b[15] == 'X') {
        if (b.size() >= 30) {
            out.width = read_le24(b, 24) + 1;
            out.height = read_le24(b, 27) + 1;
            out.format = "WEBP";
            return out.width > 0 && out.height > 0;
        }
    }
    return false;
}

static std::string escape_json(const std::string& s) {
    std::string out;
    out.reserve(s.size());
    for (char c : s) {
        if (c == '"') out += "\\\"";
        else if (c == '\\') out += "\\\\";
        else if (c == '\n') out += "\\n";
        else if (c == '\r') out += "\\r";
        else out += c;
    }
    return out;
}

static void print_json(const ImageInfo& info) {
    std::cout << "{"
              << "\"valid\":" << (info.valid ? "true" : "false") << ","
              << "\"format\":\"" << escape_json(info.format) << "\","
              << "\"width\":" << info.width << ","
              << "\"height\":" << info.height << ","
              << "\"bytes\":" << info.bytes << ","
              << "\"checksum\":\"" << escape_json(info.checksum) << "\","
              << "\"error\":\"" << escape_json(info.error) << "\""
              << "}\n";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        ImageInfo info;
        info.error = "Uso: image_analyzer <ruta_imagen>";
        print_json(info);
        return 1;
    }

    std::string arg = argv[1];
    if (arg == "--health") {
        std::cout << "{\"ok\":true,\"engine\":\"cpp17-image-analyzer\"}\n";
        return 0;
    }

    fs::path path = fs::u8path(arg);
    ImageInfo info;

    std::error_code ec;
    if (!fs::exists(path, ec) || !fs::is_regular_file(path, ec)) {
        info.error = "El archivo de imagen no existe.";
        print_json(info);
        return 1;
    }

    uint64_t fsize = fs::file_size(path, ec);
    if (ec || fsize == 0 || fsize > 15ULL * 1024ULL * 1024ULL) {
        info.error = "Tamano de archivo no valido (maximo 15 MB).";
        print_json(info);
        return 1;
    }

    std::ifstream file(path, std::ios::binary);
    if (!file) {
        info.error = "No se pudo abrir el archivo de imagen.";
        print_json(info);
        return 1;
    }

    std::vector<uint8_t> data(fsize);
    if (!file.read(reinterpret_cast<char*>(data.data()), static_cast<std::streamsize>(fsize))) {
        info.error = "Error leyendo bytes de la imagen.";
        print_json(info);
        return 1;
    }

    info.bytes = fsize;
    info.checksum = compute_fnv1a64(data);

    if (parse_png(data, info) || parse_jpeg(data, info) || parse_webp(data, info) || parse_gif(data, info)) {
        info.valid = true;
        print_json(info);
        return 0;
    }

    info.error = "Formato no soportado o firma binaria invalida (solo PNG, JPEG, WebP o GIF).";
    print_json(info);
    return 1;
}
