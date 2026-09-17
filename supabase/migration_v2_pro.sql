-- Growth Intelligence LLC Growth CRM V2 PRO migration
-- Safe additive migration for the existing growth_* tables.

create extension if not exists pgcrypto;

alter table public.growth_clients add column if not exists management_fee numeric default 0;
alter table public.growth_clients add column if not exists setup_fee numeric default 0;
alter table public.growth_clients add column if not exists ad_budget numeric default 0;
alter table public.growth_clients add column if not exists analysis_status text default 'not_started';
alter table public.growth_clients add column if not exists analysis_approved boolean default false;
alter table public.growth_clients add column if not exists portal_published boolean default false;
alter table public.growth_clients add column if not exists secondary_color text;
alter table public.growth_clients add column if not exists brand_config jsonb default '{}'::jsonb;

create table if not exists public.growth_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.growth_clients(id) on delete cascade,
  status text not null default 'queued',
  progress integer not null default 0,
  model text,
  prompt_version text,
  openai_response_id text,
  website_snapshot jsonb default '{}'::jsonb,
  result_json jsonb,
  sources_json jsonb default '[]'::jsonb,
  raw_response_meta jsonb default '{}'::jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_growth_analysis_client on public.growth_analysis_runs(client_id, created_at desc);
create unique index if not exists idx_growth_analysis_openai_response on public.growth_analysis_runs(openai_response_id) where openai_response_id is not null;

create table if not exists public.growth_onboarding_state (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.growth_clients(id) on delete cascade,
  current_step text default 'analysis',
  progress integer default 0,
  completed_steps text[] default '{}',
  payload jsonb default '{}'::jsonb,
  signature_name text,
  signature_title text,
  signed_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create unique index if not exists idx_growth_onboarding_client on public.growth_onboarding_state(client_id);

-- Ensure access rows can be safely upserted per client/platform.
create unique index if not exists idx_growth_access_client_platform on public.growth_account_access(client_id, platform);

-- Keep CRM data server-side only. The browser never gets the service-role key.
alter table public.growth_clients enable row level security;
alter table public.growth_intake_links enable row level security;
alter table public.growth_intake_submissions enable row level security;
alter table public.growth_tasks enable row level security;
alter table public.growth_activity enable row level security;
alter table public.growth_files enable row level security;
alter table public.growth_services enable row level security;
alter table public.growth_service_areas enable row level security;
alter table public.growth_account_access enable row level security;
alter table public.growth_agreements enable row level security;
alter table public.growth_analysis_runs enable row level security;
alter table public.growth_onboarding_state enable row level security;

revoke all on table public.growth_clients from anon, authenticated;
revoke all on table public.growth_intake_links from anon, authenticated;
revoke all on table public.growth_intake_submissions from anon, authenticated;
revoke all on table public.growth_tasks from anon, authenticated;
revoke all on table public.growth_activity from anon, authenticated;
revoke all on table public.growth_files from anon, authenticated;
revoke all on table public.growth_services from anon, authenticated;
revoke all on table public.growth_service_areas from anon, authenticated;
revoke all on table public.growth_account_access from anon, authenticated;
revoke all on table public.growth_agreements from anon, authenticated;
revoke all on table public.growth_analysis_runs from anon, authenticated;
revoke all on table public.growth_onboarding_state from anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table
  public.growth_clients,
  public.growth_intake_links,
  public.growth_intake_submissions,
  public.growth_tasks,
  public.growth_activity,
  public.growth_files,
  public.growth_services,
  public.growth_service_areas,
  public.growth_account_access,
  public.growth_agreements,
  public.growth_analysis_runs,
  public.growth_onboarding_state
  to service_role;
