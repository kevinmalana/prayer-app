-- Prayer App initial schema

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists prayer_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  type text not null check (type in ('family','parish','youth','friends','ministry')),
  is_private boolean not null default true,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references prayer_groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  created_at timestamptz not null default now(),
  unique(group_id, user_id)
);

create table if not exists missions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  intention text,
  prayer_type text not null check (prayer_type in ('hail_mary','rosary','novena','our_father','custom')),
  target_count integer not null check (target_count > 0),
  current_count integer not null default 0 check (current_count >= 0),
  deadline_at timestamptz,
  group_id uuid references prayer_groups(id) on delete set null,
  creator_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists mission_contributions (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references missions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  count integer not null check (count > 0),
  created_at timestamptz not null default now()
);

create table if not exists prayer_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  user_id uuid not null references profiles(id) on delete cascade,
  group_id uuid references prayer_groups(id) on delete set null,
  is_answered boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists testimonies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  prayer_request_id uuid references prayer_requests(id) on delete set null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table prayer_groups enable row level security;
alter table group_members enable row level security;
alter table missions enable row level security;
alter table mission_contributions enable row level security;
alter table prayer_requests enable row level security;
alter table testimonies enable row level security;

create policy "profiles readable by authenticated users" on profiles
for select to authenticated using (true);

create policy "users manage own profile" on profiles
for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "group members can read groups" on prayer_groups
for select to authenticated using (
  exists (
    select 1 from group_members gm
    where gm.group_id = prayer_groups.id and gm.user_id = auth.uid()
  ) or owner_id = auth.uid()
);

create policy "owners can manage groups" on prayer_groups
for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "members can read memberships" on group_members
for select to authenticated using (user_id = auth.uid());

create policy "members can join themselves" on group_members
for insert to authenticated with check (user_id = auth.uid());

create policy "authenticated can read missions" on missions
for select to authenticated using (true);

create policy "authenticated can create missions" on missions
for insert to authenticated with check (creator_id = auth.uid());

create policy "creators can update missions" on missions
for update to authenticated using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "authenticated can read contributions" on mission_contributions
for select to authenticated using (true);

create policy "users create own contributions" on mission_contributions
for insert to authenticated with check (user_id = auth.uid());

create policy "authenticated can read prayer requests" on prayer_requests
for select to authenticated using (true);

create policy "users create own prayer requests" on prayer_requests
for insert to authenticated with check (user_id = auth.uid());

create policy "users update own prayer requests" on prayer_requests
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "authenticated can read testimonies" on testimonies
for select to authenticated using (true);

create policy "users create own testimonies" on testimonies
for insert to authenticated with check (user_id = auth.uid());
