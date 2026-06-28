import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function MissionDetailScreen() {
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGoal = async () => {
    const { data } = await supabase
      .from('missions')
      .select('id,title,intention,target_count,current_count,created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    setGoal(data?.[0] ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadGoal();
  }, []);

  const addContribution = async (count: number) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
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

      await loadGoal();
    } catch (error: any) {
      Alert.alert('Contribution failed', error.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenShell
      title="Prayer Goal"
      subtitle="This is the core experience: a shared intention, visible progress, and quick contribution."
    >
      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {!loading && !goal ? (
        <SectionCard label="No prayer goal yet" title="Create a prayer goal first" support="Once one exists, you can contribute and track progress here." />
      ) : null}

      {goal ? (
        <>
          <View style={styles.heroCard}>
            <Text style={styles.heroLabel}>Featured prayer goal</Text>
            <Text style={styles.heroTitle}>{goal.title}</Text>
            <Text style={styles.heroText}>{goal.intention || 'No intention added yet.'}</Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, Math.round(((goal.current_count || 0) / Math.max(goal.target_count || 1, 1)) * 100))}%` },
                ]}
              />
            </View>
            <Text style={styles.progressMeta}>{goal.current_count} / {goal.target_count} completed</Text>
          </View>

          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.countButton} onPress={() => addContribution(1)} disabled={saving}><Text style={styles.countButtonText}>+1</Text></TouchableOpacity>
            <TouchableOpacity style={styles.countButton} onPress={() => addContribution(5)} disabled={saving}><Text style={styles.countButtonText}>+5</Text></TouchableOpacity>
            <TouchableOpacity style={styles.countButton} onPress={() => addContribution(10)} disabled={saving}><Text style={styles.countButtonText}>+10</Text></TouchableOpacity>
            <TouchableOpacity style={styles.countButton} onPress={() => addContribution(20)} disabled={saving}><Text style={styles.countButtonText}>+20</Text></TouchableOpacity>
          </View>

          <SectionCard
            label="Contribution"
            title={saving ? 'Saving contribution...' : 'Quick prayer contribution'}
            support="Tap a count to add your completed Hail Marys to the shared goal."
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
});
