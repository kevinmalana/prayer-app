import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

interface MissionRow {
  id: string;
  title: string;
  intention: string | null;
  target_count: number;
  current_count: number;
}

export function MissionsHubScreen({ navigation }: any) {
  const [missions, setMissions] = useState<MissionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('missions')
      .select('id,title,intention,target_count,current_count')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setMissions(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <ScreenShell
      title="Prayer missions"
      subtitle="Create a mission, contribute instantly, and keep the whole community moving together."
    >
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CreateMission')}>
          <Text style={styles.primaryButtonText}>Create mission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('MissionDetail')}>
          <Text style={styles.secondaryButtonText}>Open featured</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {missions.length === 0 && !loading ? (
        <SectionCard
          label="No missions yet"
          title="Create the first prayer mission"
          support="Once you create one, it will appear here for the whole app."
        />
      ) : null}

      {missions.map((mission) => (
        <TouchableOpacity key={mission.id} onPress={() => navigation.navigate('MissionDetail')}>
          <SectionCard
            label={`Target ${mission.target_count}`}
            title={mission.title}
            support={`${mission.current_count} completed${mission.intention ? ` · ${mission.intention}` : ''}`}
          />
        </TouchableOpacity>
      ))}
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
});
