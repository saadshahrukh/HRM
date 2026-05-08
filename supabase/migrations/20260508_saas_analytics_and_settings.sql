-- SaaS analytics and settings foundation

create table if not exists public.analytics_snapshots (
  id bigint generated always as identity primary key,
  user_email text not null,
  completion_rate integer not null default 0,
  recommendation_rate integer not null default 0,
  average_score numeric(4,2) not null default 0,
  quality_index integer not null default 0,
  avg_response_time numeric(5,2) not null default 0,
  total_candidates integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists analytics_snapshots_user_email_idx
  on public.analytics_snapshots(user_email);

create table if not exists public.user_settings (
  user_email text primary key,
  theme text not null default 'system',
  notifications jsonb not null default '{}'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  api_tokens jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.api_tokens (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  token_name text not null,
  token_prefix text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists api_tokens_user_email_idx on public.api_tokens(user_email);

alter table public."Users"
  add column if not exists theme_preference text default 'system',
  add column if not exists timezone text default 'UTC',
  add column if not exists language text default 'en-US',
  add column if not exists realtime_notifications boolean default true,
  add column if not exists api_access_enabled boolean default false;
