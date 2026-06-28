import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { useMissions } from '../context/MissionContext';

export function MissionsHubScreen({ navigation }: any) {
  const { missions, loading, error } = useMissions();

  return (
    <ScreenShell
      title="Prayer goals"
      subtitle="Create a prayer goal, contribute quickly, and keep the whole community moving together."
    >
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CreateMission')}>
          <Text style={styles.primaryButtonText}>Create prayer goal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, missions.length === 0 && styles.disabledButton]}
          onPress={() => {
            if (missions.length > 0) {
              navigation.navigate('MissionDetail', { missionId: missions[0].id });
            }
          }}
          disabled={missions.length === 0}
        >
          <Text style={styles.secondaryButtonText}>{missions.length > 0 ? 'Open featured' : 'No featured goal yet'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

      {!loading && error ? (
        <SectionCard
          label="Connection issue"
          title="Could not load prayer goals"
          support={error}
        />
      ) : null}

      {missions.length === 0 && !loading && !error ? (
        <SectionCard
          label="No prayer goals yet"
          title="Create the first prayer goal"
          support="Once you create one, it will appear here for the whole app."
        />
      ) : null}

      {missions.map((mission) => {
        const pct = Math.min(100, Math.round((mission.current_count / Math.max(mission.target_count, 1)) * 100));
        return (
          <TouchableOpacity key={mission.id} onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}>
            <SectionCard
              label={`Target ${mission.target_count} · ${pct}% complete`}
              title={mission.title}
              support={`${mission.current_count} completed${mission.intention ? ` · ${mission.intention}` : ''}`}
            />
          </TouchableOpacity>
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#EEF4EE',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  loader: {
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.55,
  },
});
