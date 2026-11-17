-- CLEDUCA-ODJ — schéma initial de la plateforme
--
-- Principes :
--   * aucune donnée personnelle de bénéficiaire : uniquement des agrégats et
--     des contenus institutionnels ;
--   * suppression logique (deleted_at) pour les contenus éditoriaux ;
--   * RLS activée partout : lecture publique limitée aux contenus publiés,
--     écritures réservées au personnel habilité ou à la clé de service ;
--   * le serveur Next.js utilise la clé de service (jamais exposée au
--     navigateur) et applique les permissions applicatives.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Comptes et rôles
-- ---------------------------------------------------------------------------

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'contributor'
    check (role in ('super_admin', 'admin', 'editor', 'contributor')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

alter table public.users alter column is_active set default false;

comment on table public.users is
  'Profils d’administration, liés à auth.users. Le rôle applicatif est stocké ici, jamais dans le JWT. Un compte n’est actif qu’après validation d’un administrateur.';

-- ---------------------------------------------------------------------------
-- Paramètres du site (document unique, id = 1)
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Contenus institutionnels
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  acronym text not null default '',
  summary text not null default '',
  context text not null default '',
  objectives text[] not null default '{}',
  coverage text[] not null default '{}',
  beneficiaries text[] not null default '{}',
  activities text[] not null default '{}',
  results text[] not null default '{}',
  period_label text not null default '',
  partners text[] not null default '{}',
  funders text[] not null default '{}',
  status text not null default 'development'
    check (status in ('ongoing', 'completed', 'development', 'proposed')),
  status_note text not null default '',
  area_slugs text[] not null default '{}',
  featured boolean not null default false,
  image text not null default '',
  image_alt text not null default '',
  gallery jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  content_status text not null default 'draft'
    check (content_status in ('draft', 'review', 'published', 'archived')),
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.intervention_areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  short_title text not null default '',
  tagline text not null default '',
  summary text not null default '',
  description text not null default '',
  icon text not null default 'book-open',
  status text not null default 'developing'
    check (status in ('documented', 'developing', 'positioning')),
  status_note text not null default '',
  challenges text[] not null default '{}',
  objectives text[] not null default '{}',
  audiences text[] not null default '{}',
  methodology text not null default '',
  image text not null default '',
  image_alt text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default 'actualite'
    check (category in ('actualite', 'annonce', 'projet', 'evenement', 'terrain', 'reussite', 'communique', 'publication', 'recherche')),
  author_name text not null default '',
  published_at timestamptz,
  tags text[] not null default '{}',
  project_slugs text[] not null default '{}',
  cover_image text not null default '',
  cover_alt text not null default '',
  featured boolean not null default false,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default 'rapport-annuel'
    check (category in ('rapport-annuel', 'rapport-activite', 'document-projet', 'note-politique', 'guide-educatif', 'formation', 'recherche', 'multimedia')),
  file_url text not null default '',
  file_name text not null default '',
  file_size text not null default '',
  language text not null default 'Français',
  published_at timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'technique'
    check (type in ('institutionnel', 'technique', 'financier', 'communautaire', 'local')),
  description text not null default '',
  logo_url text not null default '',
  website_url text not null default '',
  country text not null default '',
  authorization_note text not null default '',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.partners.authorization_note is
  'Référence de l’autorisation écrite obtenue avant publication du logo ou du nom.';

create table if not exists public.impact_indicators (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric,
  unit text not null default '',
  category text not null default 'beneficiaires'
    check (category in ('beneficiaires', 'projets', 'couverture', 'partenaires', 'education', 'engagement', 'inclusion', 'institutionnel')),
  description text not null default '',
  source text not null default '',
  period_label text not null default '',
  verified boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.impact_indicators.value is
  'Valeur agrégée uniquement. Aucune donnée individuelle de bénéficiaire.';

create table if not exists public.reporting_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  starts_on date,
  ends_on date,
  description text not null default '',
  source_document text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null default '',
  title text not null,
  description text not null default '',
  source text not null default '',
  verified boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_label text not null default '',
  context text not null default '',
  project_slug text not null default '',
  image text not null default '',
  consent_on_file boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.testimonials.consent_on_file is
  'Consentement écrit obligatoire avant toute publication.';

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  description text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  location text not null default '',
  registration_url text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  eyebrow text not null default '',
  intro text not null default '',
  sections jsonb not null default '[]'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Les galeries projet sont stockées dans projects.gallery (jsonb) : aucune
-- table dédiée n’est nécessaire et aucune image individuelle de bénéficiaire
-- ne doit y être référencée sans consentement.

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  url text not null,
  mime_type text not null default '',
  size bigint not null default 0,
  alt text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Communications
-- ---------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  organization text not null default '',
  inquiry_type text not null default 'information'
    check (inquiry_type in ('partenariat', 'benevolat', 'collaboration', 'information', 'presse', 'autre')),
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'closed')),
  consent boolean not null default false,
  ip_hash text not null default '',
  created_at timestamptz not null default now()
);

comment on table public.contact_messages is
  'Messages du formulaire public. Ne jamais y stocker de pièce d’identité, de dossier médical ou de statut de déplacement.';

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  source text not null default '',
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null default '',
  action text not null,
  collection text not null default '',
  entity_id text not null default '',
  summary text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Index
-- ---------------------------------------------------------------------------

create unique index if not exists projects_slug_key
  on public.projects (slug) where deleted_at is null;
create index if not exists projects_public_idx
  on public.projects (sort_order, published_at desc)
  where deleted_at is null and content_status = 'published';

create unique index if not exists intervention_areas_slug_key
  on public.intervention_areas (slug) where deleted_at is null;
create index if not exists intervention_areas_public_idx
  on public.intervention_areas (sort_order)
  where deleted_at is null and published;

create unique index if not exists news_articles_slug_key
  on public.news_articles (slug) where deleted_at is null;
create index if not exists news_articles_public_idx
  on public.news_articles (published_at desc)
  where deleted_at is null and status = 'published';
create index if not exists news_articles_search_idx
  on public.news_articles using gin (to_tsvector('french', title || ' ' || excerpt));

create index if not exists publications_public_idx
  on public.publications (published_at desc)
  where deleted_at is null and status = 'published';

create index if not exists partners_public_idx
  on public.partners (type, sort_order)
  where deleted_at is null and published;

create index if not exists impact_indicators_public_idx
  on public.impact_indicators (category, sort_order)
  where deleted_at is null and published;

create index if not exists reporting_periods_public_idx
  on public.reporting_periods (starts_on desc)
  where deleted_at is null and published;

create index if not exists milestones_public_idx
  on public.milestones (year, sort_order)
  where deleted_at is null and published;

create index if not exists testimonials_public_idx
  on public.testimonials (sort_order)
  where deleted_at is null and published;

create unique index if not exists events_slug_key
  on public.events (slug) where deleted_at is null;
create index if not exists events_public_idx
  on public.events (starts_at)
  where deleted_at is null and status = 'published';

create unique index if not exists pages_slug_key
  on public.pages (slug) where deleted_at is null;
create index if not exists pages_public_idx
  on public.pages (slug)
  where deleted_at is null and status = 'published';

create index if not exists media_assets_created_idx
  on public.media_assets (created_at desc);

create index if not exists contact_messages_inbox_idx
  on public.contact_messages (status, created_at desc);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status, created_at desc);

create index if not exists activity_logs_recent_idx
  on public.activity_logs (created_at desc);

create index if not exists users_role_idx
  on public.users (role) where is_active;

-- ---------------------------------------------------------------------------
-- Horodatage automatique
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  target text;
begin
  foreach target in array array[
    'projects', 'intervention_areas', 'news_articles', 'publications',
    'partners', 'impact_indicators', 'reporting_periods', 'milestones',
    'testimonials', 'events', 'pages', 'site_settings'
  ]
  loop
    execute format(
      'drop trigger if exists %I on public.%I', target || '_set_updated_at', target
    );
    execute format(
      'create trigger %I before update on public.%I
         for each row execute function public.set_updated_at()',
      target || '_set_updated_at', target
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Provisionnement des comptes depuis Supabase Auth
-- ---------------------------------------------------------------------------

-- raw_user_meta_data est modifiable par l’utilisateur lors d’une inscription :
-- un rôle n’y est donc jamais digne de confiance. Seul raw_app_meta_data, que
-- seule la clé de service peut écrire, peut activer un compte. Toute autre
-- inscription reste inactive jusqu’à validation par un administrateur.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  trusted_role text;
  is_trusted boolean;
begin
  trusted_role := coalesce(new.raw_app_meta_data ->> 'role', '');
  is_trusted := trusted_role in ('super_admin', 'admin', 'editor', 'contributor');

  insert into public.users (id, email, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when is_trusted then trusted_role else 'contributor' end,
    is_trusted
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(nullif(excluded.full_name, ''), public.users.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- RLS — rôles applicatifs
-- ---------------------------------------------------------------------------

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.role
  from public.users u
  where u.id = auth.uid() and u.is_active
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('super_admin', 'admin', 'editor', 'contributor'), false)
$$;

create or replace function public.can_edit_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('super_admin', 'admin', 'editor', 'contributor'), false)
$$;

create or replace function public.can_manage()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('super_admin', 'admin'), false)
$$;

alter table public.users enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.intervention_areas enable row level security;
alter table public.news_articles enable row level security;
alter table public.publications enable row level security;
alter table public.partners enable row level security;
alter table public.impact_indicators enable row level security;
alter table public.reporting_periods enable row level security;
alter table public.milestones enable row level security;
alter table public.testimonials enable row level security;
alter table public.events enable row level security;
alter table public.pages enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.activity_logs enable row level security;

-- Lecture publique des contenus publiés

drop policy if exists "published projects are public" on public.projects;
create policy "published projects are public" on public.projects
  for select to anon, authenticated
  using (deleted_at is null and content_status = 'published');

drop policy if exists "published areas are public" on public.intervention_areas;
create policy "published areas are public" on public.intervention_areas
  for select to anon, authenticated
  using (deleted_at is null and published);

drop policy if exists "published articles are public" on public.news_articles;
create policy "published articles are public" on public.news_articles
  for select to anon, authenticated
  using (deleted_at is null and status = 'published');

drop policy if exists "published publications are public" on public.publications;
create policy "published publications are public" on public.publications
  for select to anon, authenticated
  using (deleted_at is null and status = 'published');

drop policy if exists "published partners are public" on public.partners;
create policy "published partners are public" on public.partners
  for select to anon, authenticated
  using (deleted_at is null and published);

drop policy if exists "published indicators are public" on public.impact_indicators;
create policy "published indicators are public" on public.impact_indicators
  for select to anon, authenticated
  using (deleted_at is null and published);

drop policy if exists "published periods are public" on public.reporting_periods;
create policy "published periods are public" on public.reporting_periods
  for select to anon, authenticated
  using (deleted_at is null and published);

drop policy if exists "published milestones are public" on public.milestones;
create policy "published milestones are public" on public.milestones
  for select to anon, authenticated
  using (deleted_at is null and published);

drop policy if exists "published testimonials are public" on public.testimonials;
create policy "published testimonials are public" on public.testimonials
  for select to anon, authenticated
  using (deleted_at is null and published);

drop policy if exists "published events are public" on public.events;
create policy "published events are public" on public.events
  for select to anon, authenticated
  using (deleted_at is null and status = 'published');

drop policy if exists "published pages are public" on public.pages;
create policy "published pages are public" on public.pages
  for select to anon, authenticated
  using (deleted_at is null and status = 'published');

drop policy if exists "media assets are public" on public.media_assets;
create policy "media assets are public" on public.media_assets
  for select to anon, authenticated
  using (true);

drop policy if exists "site settings are public" on public.site_settings;
create policy "site settings are public" on public.site_settings
  for select to anon, authenticated
  using (true);

-- Personnel : lecture élargie (brouillons inclus)

drop policy if exists "staff reads projects" on public.projects;
create policy "staff reads projects" on public.projects
  for select to authenticated
  using (public.is_staff());

drop policy if exists "staff reads areas" on public.intervention_areas;
create policy "staff reads areas" on public.intervention_areas
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads articles" on public.news_articles;
create policy "staff reads articles" on public.news_articles
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads publications" on public.publications;
create policy "staff reads publications" on public.publications
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads partners" on public.partners;
create policy "staff reads partners" on public.partners
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads indicators" on public.impact_indicators;
create policy "staff reads indicators" on public.impact_indicators
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads periods" on public.reporting_periods;
create policy "staff reads periods" on public.reporting_periods
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads milestones" on public.milestones;
create policy "staff reads milestones" on public.milestones
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads testimonials" on public.testimonials;
create policy "staff reads testimonials" on public.testimonials
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads events" on public.events;
create policy "staff reads events" on public.events
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads pages" on public.pages;
create policy "staff reads pages" on public.pages
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads media" on public.media_assets;
create policy "staff reads media" on public.media_assets
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads messages" on public.contact_messages;
create policy "staff reads messages" on public.contact_messages
  for select to authenticated using (public.is_staff());

drop policy if exists "staff reads subscribers" on public.newsletter_subscribers;
create policy "staff reads subscribers" on public.newsletter_subscribers
  for select to authenticated using (public.is_staff());

drop policy if exists "managers read activity" on public.activity_logs;
create policy "managers read activity" on public.activity_logs
  for select to authenticated using (public.can_manage());

drop policy if exists "users read own profile" on public.users;
create policy "users read own profile" on public.users
  for select to authenticated using (id = auth.uid() or public.can_manage());

-- Écritures : personnel habilité

do $$
declare
  target text;
begin
  foreach target in array array[
    'projects', 'intervention_areas', 'news_articles', 'publications',
    'partners', 'impact_indicators', 'reporting_periods', 'milestones',
    'testimonials', 'events', 'pages', 'media_assets'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', target || '_write_staff', target);
    execute format(
      'create policy %I on public.%I for all to authenticated
         using (public.can_edit_content()) with check (public.can_edit_content())',
      target || '_write_staff', target
    );
  end loop;
end;
$$;

drop policy if exists "managers write settings" on public.site_settings;
create policy "managers write settings" on public.site_settings
  for update to authenticated
  using (public.can_manage()) with check (public.can_manage());

drop policy if exists "managers manage messages" on public.contact_messages;
create policy "managers manage messages" on public.contact_messages
  for update to authenticated
  using (public.can_manage()) with check (public.can_manage());

drop policy if exists "managers delete messages" on public.contact_messages;
create policy "managers delete messages" on public.contact_messages
  for delete to authenticated using (public.can_manage());

drop policy if exists "managers manage subscribers" on public.newsletter_subscribers;
create policy "managers manage subscribers" on public.newsletter_subscribers
  for all to authenticated
  using (public.can_manage()) with check (public.can_manage());

drop policy if exists "super admins manage users" on public.users;
create policy "super admins manage users" on public.users
  for all to authenticated
  using (public.current_app_role() = 'super_admin')
  with check (public.current_app_role() = 'super_admin');

-- Les écritures du site public (contact, lettre d’information) et celles du
-- CMS passent par le serveur Next.js avec la clé de service : aucune policy
-- d’insertion anonyme n’est donc accordée.

-- ---------------------------------------------------------------------------
-- Stockage des médias
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

drop policy if exists "media is publicly readable" on storage.objects;
create policy "media is publicly readable" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "staff uploads media" on storage.objects;
create policy "staff uploads media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "staff updates media" on storage.objects;
create policy "staff updates media" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_staff())
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "staff deletes media" on storage.objects;
create policy "staff deletes media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());
