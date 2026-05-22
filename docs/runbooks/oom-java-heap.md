# Runbook: OutOfMemoryError - Java Heap Space

## Symptoms
- Service logs "OutOfMemoryError: Java heap space" and may crash or restart.
- Memory usage climbs steadily then the process is killed (OOMKilled in k8s).
- Often follows a deploy or a change in data volume.

## Likely root causes
- Heap size (-Xmx) too small for the workload.
- Memory leak: objects retained unintentionally (caches without eviction, static collections).
- Loading large datasets fully into memory instead of streaming.

## Investigation steps
1. Capture a heap dump and inspect the largest object retainers.
2. Check whether a recent deploy changed caching or batch sizes.
3. Review GC logs for full-GC frequency and reclaimed memory.

## Remediation
- Increase -Xmx as a short-term mitigation if the host has headroom.
- Add cache eviction / size bounds.
- Stream large datasets rather than loading them whole.

## Related services
inventory, any JVM-based service.
