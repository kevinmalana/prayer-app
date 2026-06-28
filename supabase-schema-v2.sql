-- One in Prayer v2 schema adjustments

alter table prayer_groups
  add column if not exists visibility text not null default 'private' check (visibility in ('private','public')),
  add column if not exists join_mode text not null default 'invite' check (join_mode in ('invite','approval','open'));

alter table prayer_requests
  add column if not exists visibility text not null default 'group' check (visibility in ('group','public'));

alter table missions
  add column if not exists goal_unit text not null default 'hail_mary' check (goal_unit in ('hail_mary','decade','rosary'));

update group_members set role = 'member' where role not in ('owner','member');
alter table group_members drop constraint if exists group_members_role_check;
alter table group_members add constraint group_members_role_check check (role in ('owner','member'));
