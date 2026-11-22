# Plan Definitivo Antispam y Migración — Club Leganés Club

Este documento reúne todas las medidas técnicas ya aplicadas en la nueva web y los **4 pasos exactos en DNS/Hosting** para eliminar el 95–99% del SPAM en `info@clubleganesclub.es` (y aplicables también a `anyd.es` y `ditecgestiondeportiva.es`).

---

## 1. Qué se ha blindado ya en el código de la nueva web

1. **Cero direcciones de correo en texto plano en el HTML:**
   - En la web antigua, `mailto:info@clubleganesclub.es` estaba escrita en crudo en las 63 páginas (cabecera y pie). Los bots rastreadores la recolectaban continuamente.
   - En la nueva web, el correo **no existe en texto plano** en el HTML ni en el Schema JSON-LD. Solo se reconstruye dinámicamente en memoria cuando una persona hace clic en **"Mostrar correo electrónico"**.
2. **Formulario blindado en cliente y servidor (`api/contacto.php`):**
   - **Doble Honeypot:** campos trampa ocultos (`website_url`, `fax_number`) que atrapan bots automatizados.
   - **Time-Trap:** rechaza envíos realizados en menos de 3 segundos.
   - **Reto humano ligero** + soporte integrado para **Cloudflare Turnstile** (100% gratuito e invisible, sin puzzles molestos).
   - **Rate-limiting por IP:** máximo 4 envíos cada 15 minutos por IP.
   - **Filtro de contenido:** bloquea mensajes con múltiples URLs, inyección de cabeceras y patrones de spam comercial/SEO/cripto.

---

## 2. Los 4 pasos obligatorios en DNS y Hosting (donde se corta el grueso del SPAM)

Actualmente `clubleganesclub.es` sufre SPAM porque:
- Sus DNS en OVH tienen un SPF heredado con **12 IPs antiguas** terminado en `~all` (permisivo).
- **No tiene registro DMARC** (`NONE`).
- Su servidor de correo actual (`mx.clubleganesclub.es`) apenas filtra correo basura entrante.

### Paso 1 — Migrar el correo a un servidor con filtro antispam real
Tienes dos niveles de protección:
- **Nivel 1 (Incluido gratis en LucusHost / Raiola):** migra los buzones IMAP desde el servidor antiguo al cPanel nuevo y activa **SpamAssassin + MagicSpam / Imunify** con puntuación estricta (`Score 4.0` y envío directo a carpeta `Spam`).
- **Nivel 2 (Antispam nivel Gmail — 99,9% efectivo):** si el buzón `info@clubleganesclub.es` ya está quemado en cientos de listas de spam tras 20 años público, apunta solo los registros **MX** de `clubleganesclub.es` a **Google Workspace** (~6–7 €/mes por usuario, con alias gratis) o **Zoho Mail** (~1 €/mes). El filtro de Google bloquea prácticamente el 100% del spam entrante incluso en direcciones públicas antiguas.

### Paso 2 — Limpiar y endurecer los registros DNS (SPF + DKIM + DMARC)

Una vez migrado al nuevo hosting (o Google Workspace), sustituye el TXT SPF antiguo por uno limpio y añade DKIM y DMARC:

1. **SPF (Registro `TXT` en `@`):**
   - *Si usas correo en LucusHost / Raiola:*
     ```txt
     v=spf1 +a +mx include:_spf.TUPROVEEDOR.com -all
     ```
     *(cPanel → "Email Deliverability" genera la línea exacta de tu servidor; cambia `~all` por `-all` cuando compruebes que todo envía bien).*
   - *Si usas correo en Google Workspace:*
     ```txt
     v=spf1 include:_spf.google.com -all
     ```

2. **DKIM (Registro `TXT` en `default._domainkey` o `google._domainkey`):**
   - Actívalo con 1 clic en **cPanel → Email Deliverability** (o en la consola de Google Workspace) para firmar criptográficamente cada correo saliente.

3. **DMARC (Registro `TXT` en `_dmarc.clubleganesclub.es`):**
   - Durante los primeros 15 días (para comprobar que ningún envío legítimo falla):
     ```txt
     v=DMARC1; p=quarantine; pct=100; adkim=r; aspf=r; rua=mailto:dmarc@clubleganesclub.es
     ```
   - Pasados 15 días sin incidencias, pásalo a bloqueo total:
     ```txt
     v=DMARC1; p=reject; pct=100; adkim=s; aspf=s; rua=mailto:dmarc@clubleganesclub.es
     ```
   *(Aplica también este mismo DMARC a `anyd.es` y `ditecgestiondeportiva.es`, que hoy lo tienen en `p=none` sin efecto de bloqueo).*

### Paso 3 — Activar Cloudflare Turnstile gratis en el formulario (2 minutos)
1. Crea cuenta gratis en `https://dash.cloudflare.com` → **Turnstile** → **Añadir sitio** (`clubleganesclub.es`, modo *Managed*).
2. Pega la **Site Key** en `js/data.js` (`turnstileSiteKey`) y la **Secret Key** en `api/contacto.php` (`TURNSTILE_SECRET_KEY`).

### Paso 4 — Higiene del buzón (truco rápido contra spam acumulado)
- Si `info@clubleganesclub.es` sigue recibiendo spam heredado de bases de datos antiguas:
  1. Crea una dirección nueva limpia para comunicación activa con socios (p. ej. `secretaria@clubleganesclub.es` o `club@clubleganesclub.es`) y úsala solo en el formulario protegido y comunicaciones directas.
  2. Mantén `info@clubleganesclub.es` activa con filtro agresivo (o en Google Workspace) para no perder ningún mensaje legítimo de gente que ya la tenga guardada.
