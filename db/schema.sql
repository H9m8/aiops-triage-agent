-- AIOps Incident-Triage Agent — database schema
-- Target: Supabase Postgres + pgvector
-- Run this in the Supabase SQL Editor (or via psql) on a fresh project.

create extension if not exists vector;

create table if not exists documents (
  id        bigserial primary key,
  content   text,
  metadata  jsonb,
  embedding vector(1536)
);

create index if not exists documents_embedding_idx
  on documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create or replace function match_documents (
  query_embedding vector(1536),
  match_count     int default 5,
  filter          jsonb default '{}'
)
returns table (
  id        bigint,
  content   text,
  metadata  jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where documents.metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

create table if not exists logs (
  id         bigserial primary key,
  ts         timestamptz not null default now(),
  service    text        not null,
  level      text        not null,
  message    text        not null,
  trace_id   text,
  metadata   jsonb       default '{}'
);

create index if not exists logs_service_ts_idx on logs (service, ts desc);
create index if not exists logs_level_idx       on logs (level);

create table if not exists incidents (
  id                 bigserial primary key,
  fingerprint        text        not null,
  service            text        not null,
  title              text,
  severity           text,
  hypothesis         text,
  evidence           jsonb       default '[]',
  recommended_action text,
  confidence         numeric,
  github_issue_url   text,
  occurrence_count   int         not null default 1,
  first_seen         timestamptz not null default now(),
  last_seen          timestamptz not null default now()
);
alter table incidents add constraint incidents_fingerprint_key unique (fingerprint);

create index if not exists incidents_fingerprint_idx on incidents (fingerprint);
