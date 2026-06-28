import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useMissions, SharedMission } from '../context/MissionContext';

export function MissionDetailScreen({ route, navigation }: any) {
  const missionId = route?.params?.missionId;
  const { missions, loading, markStale } = useMissions();
  const [saving, setSaving] = useState(false);

  const goal: SharedMission | null = missionId
    ? (missions.find((m) => m.id === missionId) ?? null)
    : (missions.length > 0 ? missions[0] : null);

  const progressPct = useMemo(() => {
    if (!goal) return 0;
    return Math.min(100, Math.round(((goal.current_count || 0) / Math.max(goal.target_count || 1, 1)) * 100));
  }, [goal]);

  const addContribution = useCallback(async (count: number) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
      navigation.navigate('Auth');
      return;
    }

    if (!goal) return;

    setSaving(true);

    try {
      const { error: contributionError } = await supabase.from('mission_contributions').insert({
        mission_id: goal.id,
        user_id: user.id,
        count,
      });

      if (contributionError) throw contributionError;

      const { error: updateError } = await supabase
        .from('missions')
        .update({ current_count: (goal.current_count || 0) + count })
        .eq('id', goal.id);

      if (updateError) throw updateError;

      markStale();
      Alert.alert('Prayer added', `${count} prayer${count === 1 ? '' : 's'} added to this goal.`);
    } catch (error: any) {
      Alert.alert('Contribution failed', error.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }, [goal, markStale, navigation]);

  return (
    <ScreenShell
      title={goal?.title || 'Prayer Goal'}
      subtitle={goal ? 'Shared intention, visible progress, and quick contribution.' : 'Open a prayer goal to see its progress and contribute.'}
    >
      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {!loading && !goal ? (
        <SectionCard
          label="No prayer goal yet"
          title="Create a prayer goal first"
          support="Once one exists, you can contribute and track progress here."
        >
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CreateMission')}>
            <Text style={styles.primaryButtonText}>Create prayer goal</Text>
          </TouchableOpacity>
        </SectionCard>
      ) : null}

      {goal ? (
        <>
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Prayer goal</Text>
            <Text style={styles.heroTitle}>{goal.title}</Text>
            <Text style={styles.heroText}>{goal.intention || 'No intention added yet.'}</Text>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <Text style={styles.progressMeta}>{goal.current_count} / {goal.target_count} completed · {progressPct}%</Text>
          </View>

          <View style={styles.quickRow}>
            {[1, 5, 10, 20].map((count) => (
              <TouchableOpacity key={count} style={styles.countButton} onPress={() => addContribution(count)} disabled={saving}>
                <Text style={styles.countButtonText}>+{count}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionCard
            label="Contribution"
            title={saving ? 'Saving contribution...' : 'Quick prayer contribution'}
            support="Tap a count to add your completed prayers to the shared goal."
          />
        </>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 10,
  },
  heroLabel: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E4ECE4',
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6F9B72',
  },
  progressMeta: {
    color: '#6E7A70',
    fontWeight: '700',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  countButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
