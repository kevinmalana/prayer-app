import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function GroupDetailScreen() {
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('prayer_groups')
      .select('id,name,description,created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setGroup(data?.[0] ?? null);
        setLoading(false);
      });
  }, []);

  return (
    <ScreenShell
      title="Group Detail"
      subtitle="A single group page where goals, requests, and activity come together."
    >
      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {group ? (
        <>
          <SectionCard label="Prayer Group" title={group.name} support={group.description || 'No description yet.'} />
          <SectionCard label="Group ID" title={group.id} support="This ID can be used to join the group in the temporary join flow." />
          <SectionCard label="Next layer" title="Prayer goals, prayer requests, and member activity" support="This screen is the home for the social core of the app." />
        </>
      ) : (
        <SectionCard label="No group selected" title="Create a group first" support="Once groups exist, this screen can show real details and activity." />
      )}
    </ScreenShell>
  );
}
