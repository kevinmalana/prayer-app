import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import type { Profile } from '../types/domain';

interface ProfileStats {
  contributions: number;
  streakDays: number;
  groupCount: number;
}

function getInitials(name: string | null): string {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function ProfileHubScreen({ navigation }: any) {
  const { session, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState<ProfileStats>({ contributions: 0, streakDays: 0, groupCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:30');

  const user = session?.user;

  const loadStats = useCallback(async (userId: string) => {
    try {
      const [contribRes, groupsRes] = await Promise.all([
        supabase
          .from('mission_contributions')
          .select('count', { count: 'exact', head: true })
          .eq('user_id', userId),
        supabase
          .from('group_members')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      let streakDays = 0;
      const { data: contributionDates } = await supabase
        .from('mission_contributions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(60);

      if (contributionDates && contributionDates.length > 0) {
        const daySet = new Set(contributionDates.map((c) => new Date(c.created_at).toISOString().split('T')[0]));
        const today = new Date();
        let checkDate = new Date(today);
        while (daySet.has(checkDate.toISOString().split('T')[0])) {
          streakDays++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }

      setStats({
        contributions: contribRes.count ?? 0,
        streakDays,
        groupCount: groupsRes.count ?? 0,
      });
    } catch {
      // keep defaults on fetch error
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      setStatsLoading(false);
      return;
    }

    supabase
      .from('profiles')
      .select('id,full_name,avatar_url,created_at')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? null);
        setProfileLoading(false);
      });

    loadStats(user.id);
  }, [user?.id, loadStats]);

  const handleSaveReminder = () => {
    Alert.alert('Reminder saved', `Daily prayer reminder set for ${reminderTime}. Push delivery is not wired yet, but the reminder flow is now active.`);
    setShowReminderForm(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]);
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Member';
  const initials = getInitials(profile?.full_name ?? null);
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  const isLoading = sessionLoading || profileLoading || statsLoading;

  if (isLoading) {
    return (
      <ScreenShell title="Profile" subtitle="Loading your prayer profile…">
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      </ScreenShell>
    );
  }

  if (session && user) {
    return (
      <ScreenShell title="Profile" subtitle={`Welcome back, ${displayName}.`}>
        <View style={styles.identityCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials || displayName[0]?.toUpperCase() || '?'}</Text>
          </View>
          <View style={styles.identityTextBlock}>
            <Text style={styles.identityName} numberOfLines={1}>{profile?.full_name || displayName}</Text>
            <Text style={styles.identityEmail} numberOfLines={1}>{user.email}</Text>
            {memberSince ? <Text style={styles.identityMember}>Member since {memberSince}</Text> : null}
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={20} color="#6F9B72" />
            <Text style={styles.statValue}>{stats.streakDays}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="hand-left-outline" size={20} color="#6F9B72" />
            <Text style={styles.statValue}>{stats.contributions}</Text>
            <Text style={styles.statLabel}>Prayers</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={20} color="#6F9B72" />
            <Text style={styles.statValue}>{stats.groupCount}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Prayer life</Text>

          <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('Main', { screen: 'Goals' })}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionTitle}>My prayer goals</Text>
              <Text style={styles.actionSupport}>View and contribute to your active goals</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B8C4B9" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('PrayerRequests')}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="heart-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionTitle}>My prayer requests</Text>
              <Text style={styles.actionSupport}>Requests you've posted and their answers</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B8C4B9" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.actionRow} onPress={() => setShowReminderForm(!showReminderForm)}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionTitle}>Reminders</Text>
              <Text style={styles.actionSupport}>Daily prayer reminder at {reminderTime}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B8C4B9" />
          </TouchableOpacity>

          {showReminderForm ? (
            <View style={styles.reminderCard}>
              <Text style={styles.reminderTitle}>Daily prayer reminder</Text>
              <TextInput
                style={styles.reminderInput}
                value={reminderTime}
                onChangeText={setReminderTime}
                placeholder="20:30"
                placeholderTextColor="#94A39A"
              />
              <TouchableOpacity style={styles.reminderButton} onPress={handleSaveReminder}>
                <Text style={styles.reminderButtonText}>Save reminder</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity style={styles.actionRow} onPress={() => navigation.navigate('Auth')}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="person-circle-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionTitle}>Account</Text>
              <Text style={styles.actionSupport}>Manage your account details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B8C4B9" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color="#C44" />
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Profile" subtitle="Sign in to track your prayer rhythm, join groups, and build a consistent prayer life.">
      <View style={styles.signedOutCard}>
        <Ionicons name="person-circle-outline" size={56} color="#AAB8AC" style={styles.signedOutIcon} />
        <Text style={styles.signedOutTitle}>You're not signed in</Text>
        <Text style={styles.signedOutBody}>
          Creating an account lets you track your prayer goals, join groups, post prayer requests, and build a daily rhythm alongside the Church calendar.
        </Text>
        <TouchableOpacity style={styles.signedOutButton} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.signedOutButtonText}>Sign in or create account</Text>
        </TouchableOpacity>
      </View>

      <SectionCard
        label="Why sign in?"
        title="Your prayer life, together"
        support="A unified profile across prayer goals, groups, requests, and Church daily rhythm. Nothing is gamified — everything is prayer."
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: 32,
  },
  identityCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  identityTextBlock: {
    flex: 1,
    gap: 4,
  },
  identityName: {
    color: '#2A372E',
    fontSize: 21,
    fontWeight: '800',
  },
  identityEmail: {
    color: '#607065',
    fontSize: 14,
  },
  identityMember: {
    color: '#8C988E',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#2A372E',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: '#8C988E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionBlock: {
    gap: 12,
  },
  sectionTitle: {
    color: '#6E7A70',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EDF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextBlock: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    color: '#2A372E',
    fontSize: 16,
    fontWeight: '700',
  },
  actionSupport: {
    color: '#8C988E',
    fontSize: 13,
    lineHeight: 18,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 18,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#FDD',
  },
  signOutText: {
    color: '#C44',
    fontSize: 15,
    fontWeight: '700',
  },
  signedOutCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    gap: 12,
  },
  signedOutIcon: {
    marginBottom: 4,
  },
  signedOutTitle: {
    color: '#2A372E',
    fontSize: 20,
    fontWeight: '800',
  },
  signedOutBody: {
    color: '#6E7A70',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  signedOutButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  signedOutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  reminderCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 16,
    gap: 12,
  },
  reminderTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  reminderInput: {
    backgroundColor: '#F5F8F4',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
  },
  reminderButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
  },
  reminderButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
