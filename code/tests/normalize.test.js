const test = require('node:test');
const assert = require('node:assert');
const { signatureOf, normalizeIncident } = require('../normalize.js');

test('signatureOf collapses digits to N', () => {
  assert.strictEqual(
    signatureOf('PaymentGateway timeout after 30000ms'),
    'PaymentGateway timeout after Nms'
  );
});

test('signatureOf collapses hex/trace ids to ID', () => {
  assert.strictEqual(
    signatureOf('request a1b2c3d4e5 failed'),
    'request ID failed'
  );
});

test('two alerts differing only in numbers share a fingerprint', () => {
  const a = normalizeIncident({ service: 'checkout-api', message: 'timeout after 30000ms' });
  const b = normalizeIncident({ service: 'checkout-api', message: 'timeout after 12ms' });
  assert.strictEqual(a.fingerprint, b.fingerprint);
});

test('normalizeIncident lowercases service and uppercases level', () => {
  const r = normalizeIncident({ service: 'Checkout-API', level: 'error', message: 'x' });
  assert.strictEqual(r.service, 'checkout-api');
  assert.strictEqual(r.level, 'ERROR');
});

test('normalizeIncident handles missing fields with safe defaults', () => {
  const r = normalizeIncident({});
  assert.strictEqual(r.service, 'unknown');
  assert.strictEqual(r.level, 'ERROR');
  assert.strictEqual(r.message, '');
  assert.strictEqual(r.fingerprint, 'unknown:');
});

test('fingerprint format is service:signature', () => {
  const r = normalizeIncident({ service: 'inventory', message: 'OutOfMemoryError heap' });
  assert.strictEqual(r.fingerprint, 'inventory:OutOfMemoryError heap');
});
