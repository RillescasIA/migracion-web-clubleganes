<?php
/**
 * Endpoint blindado contra SPAM para Club Leganés Club
 * Capas activas:
 *  1. Solo POST + verificación de origen (Same-Origin / Referer)
 *  2. Doble Honeypot (campos trampa invisibles para humanos)
 *  3. Time-Trap (rechaza envíos hechos en < 3 segundos por bots)
 *  4. Verificación server-side opcional de Cloudflare Turnstile (gratuita)
 *  5. Rate-limiting por IP (máx. 4 envíos cada 15 minutos)
 *  6. Filtro heurístico anti-spam (URLs múltiples, palabras clave abusivas, inyección de cabeceras)
 */

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// ================= CONFIGURACIÓN =================
const DESTINO_EMAIL = 'info@clubleganesclub.es';
const REMITENTE_DOMINIO = 'no-reply@clubleganesclub.es';
const ALLOWED_HOSTS = ['clubleganesclub.es', 'www.clubleganesclub.es', 'localhost', '127.0.0.1'];

// Opcional (RECOMENDADO): crea gratis tu clave en https://dash.cloudflare.com -> Turnstile
// y pégala aquí para activar verificación invisible en servidor.
const TURNSTILE_SECRET_KEY = '';

const MIN_FILL_SECONDS = 3;
const MAX_FILL_SECONDS = 7200; // 2 horas
const RATE_LIMIT_MAX = 4;
const RATE_LIMIT_WINDOW = 900; // 15 minutos
// =================================================

function jsonResponse(int $code, bool $ok, string $message): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(405, false, 'Método no permitido.');
}

// 1. Verificar Origin / Referer si está presente
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    if ($host && !in_array(strtolower($host), ALLOWED_HOSTS, true)) {
        jsonResponse(403, false, 'Origen de solicitud no autorizado.');
    }
}

// Leer cuerpo JSON o form-urlencoded
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    $data = $_POST;
}

// 2. Doble Honeypot (si un bot rellena cualquiera de los dos, devolvemos éxito falso para no entrenarlo)
$hp1 = trim((string)($data['website_url'] ?? ''));
$hp2 = trim((string)($data['fax_number'] ?? ''));
if ($hp1 !== '' || $hp2 !== '') {
    jsonResponse(200, true, 'Solicitud recibida correctamente.');
}

// 3. Time-Trap (los bots envían en milisegundos)
$formLoadedAt = (int)($data['form_loaded_at'] ?? 0);
$nowMs = (int)round(microtime(true) * 1000);
if ($formLoadedAt <= 0) {
    jsonResponse(400, false, 'Solicitud inválida. Recarga la página e inténtalo de nuevo.');
}
$elapsedSec = ($nowMs - $formLoadedAt) / 1000;
if ($elapsedSec < MIN_FILL_SECONDS || $elapsedSec > MAX_FILL_SECONDS) {
    jsonResponse(429, false, 'Por favor, tómate un momento para completar el formulario y vuelve a intentarlo.');
}

// 4. Rate limiting simple por IP
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/clc_rate_' . hash('sha256', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $stored = json_decode((string)@file_get_contents($rateFile), true);
    if (is_array($stored)) {
        $hits = array_values(array_filter($stored, fn($ts) => is_int($ts) && ($now - $ts) < RATE_LIMIT_WINDOW));
    }
}
if (count($hits) >= RATE_LIMIT_MAX) {
    jsonResponse(429, false, 'Has realizado demasiados envíos seguidos. Espera unos minutos o escríbenos por WhatsApp.');
}

// 5. Verificación Cloudflare Turnstile (si está configurado)
if (TURNSTILE_SECRET_KEY !== '') {
    $token = trim((string)($data['cf_turnstile_response'] ?? $data['cf-turnstile-response'] ?? ''));
    if ($token === '') {
        jsonResponse(400, false, 'Completa la verificación de seguridad anti-spam.');
    }
    $verifyPayload = http_build_query([
        'secret' => TURNSTILE_SECRET_KEY,
        'response' => $token,
        'remoteip' => $ip,
    ]);
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $verifyPayload,
            'timeout' => 8,
        ],
    ]);
    $verifyRes = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
    $verifyJson = json_decode($verifyRes ?: '', true);
    if (empty($verifyJson['success'])) {
        jsonResponse(403, false, 'No se pudo verificar que eres una persona. Recarga e inténtalo de nuevo.');
    }
}

// 6. Validación y saneado de campos
$nombre = trim(strip_tags((string)($data['nombre'] ?? '')));
$email = trim((string)($data['email'] ?? ''));
$telefono = trim(strip_tags((string)($data['telefono'] ?? '')));
$motivo = trim(strip_tags((string)($data['motivo'] ?? 'Consulta general')));
$actividad = trim(strip_tags((string)($data['actividad'] ?? 'No especificada')));
$pabellon = trim(strip_tags((string)($data['pabellon'] ?? 'No especificado')));
$mensaje = trim(strip_tags((string)($data['mensaje'] ?? '')));
$privacidad = !empty($data['privacidad']);

// Evitar inyección de cabeceras (CRLF)
$cleanLine = fn(string $s) => preg_replace('/[\r\n]+/', ' ', $s);
$nombre = $cleanLine($nombre);
$motivo = $cleanLine($motivo);
$actividad = $cleanLine($actividad);
$pabellon = $cleanLine($pabellon);

if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 100) {
    jsonResponse(400, false, 'Introduce un nombre válido (mínimo 3 caracteres).');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) {
    jsonResponse(400, false, 'Introduce un correo electrónico válido.');
}
if (mb_strlen($mensaje) < 6 || mb_strlen($mensaje) > 3000) {
    jsonResponse(400, false, 'Escribe un mensaje breve con tu consulta (mínimo 6 caracteres).');
}
if (!$privacidad) {
    jsonResponse(400, false, 'Debes aceptar la política de privacidad.');
}

// 7. Filtro heurístico anti-spam (bloquea bots comerciales, SEO spam, cripto y enlaces masivos)
$textoCompleto = mb_strtolower($nombre . ' ' . $mensaje);
$urlMatches = preg_match_all('/(https?:\/\/|www\.|\.[a-z]{2,4}\/)/i', $textoCompleto);
if ($urlMatches >= 2) {
    jsonResponse(400, false, 'Por seguridad anti-spam, el mensaje no puede contener múltiples enlaces web.');
}

$spamPatterns = [
    '/\b(viagra|cialis|casino|betting|crypto|bitcoin|forex|backlinks|seo\s+agency|guest\s+post|web\s+traffic|whatsapp\s+bulk|porn|escort|loan\s+offer)\b/i',
    '/\[url=|\[link=|<a\s+href/i',
];
foreach ($spamPatterns as $pattern) {
    if (preg_match($pattern, $textoCompleto)) {
        // Silencioso para que el bot crea que pasó
        jsonResponse(200, true, 'Solicitud recibida correctamente.');
    }
}

// Registrar intento en rate limit
$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits));

// 8. Envío limpio compatible con SPF/DKIM/DMARC (From del propio dominio + Reply-To del usuario)
$subject = "=?UTF-8?B?" . base64_encode("[Web Club Leganés] {$motivo} - {$nombre}") . "?=";
$body = implode("\r\n", [
    "Nueva solicitud recibida desde la web de Club Leganés Club:",
    "------------------------------------------------------------",
    "Motivo:     {$motivo}",
    "Nombre:     {$nombre}",
    "Email:      {$email}",
    "Teléfono:   " . ($telefono !== '' ? $telefono : 'No indicado'),
    "Actividad:  {$actividad}",
    "Pabellón:   {$pabellon}",
    "------------------------------------------------------------",
    "Mensaje:",
    $mensaje,
    "",
    "---",
    "IP origen: {$ip} | Fecha: " . date('Y-m-d H:i:s'),
]);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Web Club Leganes Club <' . REMITENTE_DOMINIO . '>',
    'Reply-To: ' . $nombre . ' <' . $email . '>',
    'X-Mailer: ClubLeganesClub-AntiSpam/1.0',
]);

$sent = @mail(DESTINO_EMAIL, $subject, $body, $headers, '-f' . REMITENTE_DOMINIO);
if (!$sent) {
    jsonResponse(500, false, 'No se pudo enviar en este momento. Por favor, contáctanos por WhatsApp al 641 889 825.');
}

jsonResponse(200, true, '¡Mensaje enviado correctamente! Te responderemos lo antes posible.');
