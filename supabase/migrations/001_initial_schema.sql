-- Categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  cover_image text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Subcategories
create table subcategories (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  category_id uuid not null references categories(id) on delete cascade,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index idx_subcategories_category on subcategories(category_id);

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  category_id uuid not null references categories(id) on delete cascade,
  subcategory_id uuid references subcategories(id) on delete set null,
  video text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index idx_projects_category on projects(category_id);
create index idx_projects_subcategory on projects(subcategory_id);

-- Project images
create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  src text not null,
  width int not null,
  height int not null,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_project_images_project on project_images(project_id);

-- RLS: enable and allow public reads on all tables
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Public read subcategories" on subcategories for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read project_images" on project_images for select using (true);
