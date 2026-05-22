# Runbook: Database Connection Pool Exhaustion

## Symptoms
- Services report "Connection pool exhausted" or "max connections reached" errors.
- Downstream calls (e.g. payment gateway, external APIs) time out under load.
- Latency spikes correlate with traffic peaks; errors clear when traffic drops.

## Likely root causes
- Pool max size set too low for current concurrency (common default: 20).
- Connections leaked: not returned to the pool after use (missing close/finally).
- Long-running queries holding connections, starving short requests.
- A downstream dependency slowing down, causing connections to pile up waiting.

## Investigation steps
1. Check current pool max and active connection count.
2. Correlate error timestamps with traffic and downstream latency.
3. Look for queries with unusually long duration holding connections.
4. Check for recent deploys that changed query patterns or pool config.

## Remediation
- Increase pool max (e.g. 20 -> 50) as an immediate mitigation.
- Add a circuit breaker on slow downstream dependencies.
- Fix connection leaks (ensure connections are released in a finally block).
- Add pool saturation alerting before exhaustion occurs.

## Related services
checkout-api, payment processing, any service with a DB-backed request path.
