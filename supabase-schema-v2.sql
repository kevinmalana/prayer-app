-- One in Prayer v2 schema adjustments

alter table prayer_groups
  add column if not exists visibility text not null default 'private' check (visibility in ('private','public')),
  add column if not exists join_mode text not null default 'invite' check (join_mode in ('invite','approval','open'));

alter table prayer_requests
  add column if not exists visibility text not null default 'group' check (visibility in ('group','public'));

alter table missions
  add column if not exists goal_unit text not null default 'hail_mary' check (goal_unit in ('hail_mary','decade','rosary'));

create table if not exists group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references prayer_groups(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table prayer_groups
  add column if not exists current_intention text,
  add column if not exists intention_updated_at timestamptz;

alter table group_members
  add column if not exists last_active_at timestamptz;

alter table group_messages enable row level security;

create policy "authenticated can read group messages" on group_messages
for select to authenticated using (true);

create policy "users create own group messages" on group_messages
for insert to authenticated with check (user_id = auth.uid());

update group_members set role = 'member' where role not in ('owner','member');
alter table group_members drop constraint if exists group_members_role_check;
alter table group_members add constraint group_members_role_check check (role in ('owner','member'));
