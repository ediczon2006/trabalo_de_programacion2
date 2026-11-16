package com.ediczon.software.http;

import com.ediczon.software.db.Database.SavedImage;
import com.ediczon.software.db.Database.SolicitudRecord;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Genera la vista HTML publica de una solicitud guardada en SQLite (/ver/{codigo})
 * para visualizar el requerimiento e imagenes enviadas desde el enlace de WhatsApp.
 */
public final class SolicitudRenderer {
    private SolicitudRenderer() {}

    public static String renderHtml(SolicitudRecord rec, String whatsappDigits) {
        StringBuilder tipos = new StringBuilder();
        for (String t : rec.tiposProyecto) {
            tipos.append("<span class=\"pill\">").append(esc(t)).append("</span>");
        }
        if (tipos.isEmpty()) {
            tipos.append("<span class=\"pill\">Software a medida</span>");
        }

        StringBuilder funcs = new StringBuilder();
        if (rec.funciones.isEmpty()) {
            funcs.append("<span class=\"muted\">Sin funciones especificas marcadas</span>");
        } else {
            for (String f : rec.funciones) {
                funcs.append("<span class=\"pill pill--soft\">").append(esc(f)).append("</span>");
            }
        }

        StringBuilder imgs = new StringBuilder();
        if (rec.imagenes.isEmpty()) {
            imgs.append("<p class=\"muted\">El cliente no adjunto imagenes de referencia.</p>");
        } else {
            imgs.append("<div class=\"gallery\">");
            for (SavedImage im : rec.imagenes) {
                imgs.append("<figure class=\"img-card\">")
                    .append("<a href=\"").append(esc(im.url)).append("\" target=\"_blank\" rel=\"noopener\">")
                    .append("<img src=\"").append(esc(im.url)).append("\" alt=\"").append(esc(im.nombreOriginal)).append("\" loading=\"lazy\" />")
                    .append("</a>")
                    .append("<figcaption>")
                    .append("<strong>").append(esc(im.nombreOriginal)).append("</strong>")
                    .append("<span>").append(im.anchoPx).append(" × ").append(im.altoPx).append(" px · ")
                    .append(Math.max(1, im.tamanoBytes / 1024)).append(" KB</span>");
                if (im.descripcionUsuario != null && !im.descripcionUsuario.isBlank()) {
                    imgs.append("<p class=\"note\">").append(esc(im.descripcionUsuario)).append("</p>");
                }
                imgs.append("</figcaption></figure>");
            }
            imgs.append("</div>");
        }

        String waUrl = "https://wa.me/" + whatsappDigits + "?text=" +
            URLEncoder.encode(rec.mensajeWhatsapp, StandardCharsets.UTF_8).replace("+", "%20");

        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Solicitud %s | Detalle e Imagenes</title>
              <style>
                :root { color-scheme: light; font-family: "Segoe UI", system-ui, -apple-system, sans-serif; }
                body { margin: 0; background: #f1f5f9; color: #0f172a; line-height: 1.5; }
                .wrap { max-width: 960px; margin: 32px auto; padding: 0 18px; }
                .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(15,23,42,.06); margin-bottom: 20px; }
                .top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 16px; }
                .code { display: inline-block; background: #0f172a; color: #fff; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: 700; }
                h1 { margin: 8px 0 4px; font-size: 24px; }
                .muted { color: #64748b; font-size: 14px; margin: 0; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 18px; }
                .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
                .meta small { display: block; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
                .meta strong { font-size: 15px; }
                .pill { display: inline-block; background: #e0f2fe; color: #0369a1; border-radius: 999px; padding: 4px 12px; font-size: 13px; font-weight: 600; margin: 4px 6px 0 0; }
                .pill--soft { background: #f1f5f9; color: #334155; }
                .desc { background: #f8fafc; border-left: 4px solid #0ea5e9; padding: 14px 16px; border-radius: 8px; white-space: pre-wrap; margin: 10px 0 18px; }
                .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-top: 12px; }
                .img-card { margin: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #fff; }
                .img-card img { width: 100%%; height: 190px; object-fit: cover; display: block; background: #e2e8f0; }
                .img-card figcaption { padding: 10px 12px; font-size: 13px; }
                .img-card figcaption strong { display: block; word-break: break-word; }
                .img-card figcaption span { color: #64748b; font-size: 12px; }
                .note { margin: 6px 0 0; color: #0f172a; background: #f8fafc; padding: 6px 8px; border-radius: 6px; }
                .actions { display: flex; flex-wrap: wrap; gap: 10px; }
                .btn { display: inline-block; text-decoration: none; padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 14px; }
                .btn--wa { background: #16a34a; color: #fff; }
                .btn--back { background: #0f172a; color: #fff; }
              </style>
            </head>
            <body>
              <div class="wrap">
                <div class="card">
                  <div class="top">
                    <div>
                      <span class="code">%s</span>
                      <h1>Solicitud de %s</h1>
                      <p class="muted">Registrado el %s</p>
                    </div>
                    <div class="actions">
                      <a class="btn btn--wa" href="%s" target="_blank" rel="noopener">Abrir en WhatsApp</a>
                      <a class="btn btn--back" href="/">Volver a la pagina</a>
                    </div>
                  </div>
                  <div class="grid">
                    <div class="meta"><small>Negocio / Rubro</small><strong>%s</strong></div>
                    <div class="meta"><small>Contacto</small><strong>%s</strong></div>
                    <div class="meta"><small>Plazo estimado</small><strong>%s</strong></div>
                  </div>
                  <div><strong>Tipo de solucion:</strong><div>%s</div></div>
                  <div style="margin-top:14px;"><strong>Funciones solicitadas:</strong><div>%s</div></div>
                  <div style="margin-top:16px;"><strong>Que quiere que haga el software:</strong><div class="desc">%s</div></div>
                </div>
                <div class="card">
                  <h2 style="margin-top:0;font-size:18px;">Imagenes de referencia adjuntas (%d)</h2>
                  %s
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                esc(rec.codigo),
                esc(rec.codigo),
                esc(rec.nombreCliente),
                esc(rec.createdAt),
                esc(waUrl),
                esc(rec.empresaRubro.isBlank() ? "No especificado" : rec.empresaRubro),
                esc(rec.contactoCliente.isBlank() ? "No especificado" : rec.contactoCliente),
                esc(rec.plazo),
                tipos.toString(),
                funcs.toString(),
                esc(rec.descripcion),
                rec.imagenes.size(),
                imgs.toString()
            );
    }

    private static String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
