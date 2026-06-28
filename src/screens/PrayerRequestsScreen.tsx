import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

interface PrayerRequestRow {
  id: string;
  title: string;
  body: string;
  is_answered: boolean;
  visibility: 'group' | 'public';
}

export function PrayerRequestsScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [items, setItems] = useState<PrayerRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadRequests = async () => {
    const { data } = await supabase
      .from('prayer_requests')
      .select('id,title,body,is_answered,visibility')
      .order('created_at', { ascending: false })
      .limit(20);

    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

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
      const { error } = await supabase.from('prayer_requests').insert({
        title,
        body,
        user_id: user.id,
        visibility: 'group',
      });

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

  return (
    <ScreenShell
      title="Prayer Requests"
      subtitle="Post requests, invite prayer, and build the real communal heart of the app."
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
