// code/normalize.js
// Pure incident-normalization logic, extracted from the n8n Code node so it
// can be unit-tested independently of the workflow. The n8n Code node mirrors
// this logic; keep them in sync.

function signatureOf(message) {
  return String(message ?? '')
    .replace(/\b[0-9a-f]{8,}\b/gi, 'ID')
    .replace(/\d+/g, 'N')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

function normalizeIncident(body = {}) {
  const service = String(body.service ?? 'unknown').trim().toLowerCase();
  const level = String(body.level ?? 'ERROR').trim().toUpperCase();
  const message = String(body.message ?? '').trim();
  const signature = signatureOf(message);

  return {
    service,
    level,
    message,
    signature,
    fingerprint: `${service}:${signature}`,
  };
}

module.exports = { signatureOf, normalizeIncident };
