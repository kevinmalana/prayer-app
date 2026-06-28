import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { AuthGateCard } from '../components/AuthGateCard';

interface PrayerRequestRow {
  id: string;
  title: string;
  body: string;
  is_answered: boolean;
  visibility: 'group' | 'public';
  group_id: string | null;
}

export function PrayerRequestsScreen({ navigation, route }: any) {
  const groupId = route?.params?.groupId ?? null;
  const { session, loading: sessionLoading } = useSession();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [items, setItems] = useState<PrayerRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRequests = async () => {
    let query = supabase
      .from('prayer_requests')
      .select('id,title,body,is_answered,visibility,group_id')
      .order('created_at', { ascending: false })
      .limit(20);

    if (groupId) {
      query = query.eq('group_id', groupId);
    }

    const { data } = await query;
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [groupId]);

  const handleCreate = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Missing details', 'Please enter a title and prayer request.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
      navigation.navigate('Auth');
      return;
    }

    setSaving(true);

    try {
      const payload: any = {
        title,
        body,
        user_id: user.id,
        visibility: 'group',
      };

      if (groupId) {
        payload.group_id = groupId;
      }

      const { error } = await supabase.from('prayer_requests').insert(payload);

      if (error) throw error;

      setTitle('');
      setBody('');
      await loadRequests();
    } catch (error: any) {
      Alert.alert('Create failed', error.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading) {
    return (
      <ScreenShell
        title={groupId ? 'Group Prayer Requests' : 'Prayer Requests'}
        subtitle="Checking your account…"
      >
        <View />
      </ScreenShell>
    );
  }

  if (!session) {
    return (
      <ScreenShell
        title={groupId ? 'Group Prayer Requests' : 'Prayer Requests'}
        subtitle={groupId ? 'Sign in before posting requests in this group.' : 'Sign in before posting or managing prayer requests.'}
      >
        <AuthGateCard
          title="Post prayer requests with an account"
          body={groupId
            ? 'Signing in keeps your group requests tied to your profile and makes it clear who is asking for prayer.'
            : 'Signing in lets your requests, answers, and prayer activity stay connected to you over time.'}
          onPress={() => navigation.navigate('Auth')}
        />

        {!groupId && items.map((item) => (
          <SectionCard
            key={item.id}
            label={item.is_answered ? 'Answered prayer' : item.visibility === 'public' ? 'Public prayer request' : 'Group prayer request'}
            title={item.title}
            support={item.body}
          />
        ))}
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title={groupId ? 'Group Prayer Requests' : 'Prayer Requests'}
      subtitle={groupId ? 'Post requests for this group and pray together.' : 'Post requests, invite prayer, and build the real communal heart of the app.'}
    >
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Request title"
          placeholderTextColor="#94A39A"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="What should we pray for?"
          placeholderTextColor="#94A39A"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreate} disabled={saving}>
          <Text style={styles.primaryButtonText}>{saving ? 'Posting...' : 'Post prayer request'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {items.map((item) => (
        <SectionCard
          key={item.id}
          label={item.is_answered ? 'Answered prayer' : item.visibility === 'public' ? 'Public prayer request' : 'Group prayer request'}
          title={item.title}
          support={item.body}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 14,
  },
  input: {
    backgroundColor: '#F5F8F4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  primaryButton: {
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