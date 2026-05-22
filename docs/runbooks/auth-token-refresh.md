# Runbook: Auth Token Refresh Failures

## Symptoms
- Spikes in 401/403 responses across services that depend on auth-service.
- Logs show token refresh failures or expired-token errors.

## Likely root causes
- Clock skew between services causing premature token expiry.
- auth-service downtime or rate limiting during refresh storms.
- Misconfigured token TTL after a deploy.

## Investigation steps
1. Check auth-service health and error rate.
2. Verify NTP/clock sync across affected hosts.
3. Confirm token TTL config matches expectations.

## Remediation
- Stagger refreshes / add jitter to avoid refresh storms.
- Fix clock sync.
- Cache valid tokens until shortly before expiry.

## Related services
auth-service, any service consuming auth tokens.
