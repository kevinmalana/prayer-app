export type PrayerGroupType = 'family' | 'parish' | 'youth' | 'friends' | 'ministry';
export type PrayerGroupVisibility = 'private' | 'public';
export type PrayerJoinMode = 'invite' | 'approval' | 'open';
export type PrayerMissionType = 'hail_mary' | 'rosary' | 'novena' | 'our_father' | 'custom';
export type PrayerGoalUnit = 'hail_mary' | 'decade' | 'rosary';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface PrayerGroup {
  id: string;
  name: string;
  description: string | null;
  type: PrayerGroupType;
  is_private: boolean;
  visibility: PrayerGroupVisibility;
  join_mode: PrayerJoinMode;
  owner_id: string;
  current_intention?: string | null;
  intention_updated_at?: string | null;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  intention: string | null;
  prayer_type: PrayerMissionType;
  target_count: number;
  current_count: number;
  goal_unit: PrayerGoalUnit;
  deadline_at: string | null;
  group_id: string | null;
  creator_id: string;
  created_at: string;
}

export interface PrayerRequest {
  id: string;
  title: string;
  body: string;
  user_id: string;
  group_id: string | null;
  is_answered: boolean;
  visibility: 'group' | 'public';
  created_at: string;
}

export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  body: string;
  created_at: string;
}
