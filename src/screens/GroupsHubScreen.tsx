import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

interface GroupRow {
  id: string;
  name: string;
  description: string | null;
  type: string;
  visibility: string;
}

export function GroupsHubScreen({ navigation }: any) {
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('prayer_groups')
      .select('id,name,description,type,visibility')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setGroups(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <ScreenShell
      title="Groups"
      subtitle="Family, parish, youth, and ministry spaces where prayer becomes shared and consistent."
    >
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CreateGroup')}>
          <Text style={styles.primaryButtonText}>Create group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('JoinGroup')}>
          <Text style={styles.secondaryButtonText}>Join group</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.secondaryFullButton} onPress={() => navigation.navigate('PrayerRequests')}>
        <Text style={styles.secondaryFullButtonText}>All prayer requests</Text>
      </TouchableOpacity>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {groups.length === 0 && !loading ? (
        <SectionCard
          label="No groups yet"
          title="No prayer groups found"
          support="Create a group or join one when group data is available."
        />
      ) : null}

      {groups.map((group) => (
        <TouchableOpacity
          key={group.id}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
        >
          <SectionCard
            label={`${group.type} · ${group.visibility}`}
            title={group.name}
            support={group.description || 'Open this group to view its details and activity.'}
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
  secondaryFullButton: {
    backgroundColor: '#EEF4EE',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryFullButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
});