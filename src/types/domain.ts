export type PrayerGroupType = 'family' | 'parish' | 'youth' | 'friends' | 'ministry';
export type PrayerMissionType = 'hail_mary' | 'rosary' | 'novena' | 'our_father' | 'custom';

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
  owner_id: string;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  intention: string | null;
  prayer_type: PrayerMissionType;
  target_count: number;
  current_count: number;
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
  created_at: string;
}
