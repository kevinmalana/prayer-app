import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { AuthGateCard } from '../components/AuthGateCard';

export function CreateGroupScreen({ navigation }: any) {
  const { session, loading: sessionLoading } = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a group name.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please create an account or sign in first.');
      navigation.navigate('Auth');
      return;
    }

    setLoading(true);

    try {
      const { data: groupData, error } = await supabase.from('prayer_groups').insert({
        name,
        description: description || null,
        type: 'family',
        is_private: visibility === 'private',
        visibility,
        join_mode: visibility === 'private' ? 'invite' : 'open',
        owner_id: user.id,
      }).select('id').single();

      if (error) throw error;

      if (groupData?.id) {
        const { error: membershipError } = await supabase.from('group_members').insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'owner',
        });

        if (membershipError && !membershipError.message?.toLowerCase().includes('duplicate')) {
          throw membershipError;
        }
      }

      Alert.alert('Group created', 'Your prayer group has been created.');
      navigation.navigate('GroupDetail', { groupId: groupData?.id });
    } catch (error: any) {
      Alert.alert('Create failed', error.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <ScreenShell
        title="Create Group"
        subtitle="Checking your account…"
      >
        <View />
      </ScreenShell>
    );
  }

  if (!session) {
    return (
      <ScreenShell
        title="Create Group"
        subtitle="Sign in before starting a prayer group."
      >
        <AuthGateCard
          title="Create groups with an account"
          body="Signing in lets your family, parish, or ministry group be owned by you and managed safely over time."
          onPress={() => navigation.navigate('Auth')}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      title="Create Group"
      subtitle="Start a family, parish, youth, or ministry prayer space."
    >
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Group name"
          placeholderTextColor="#94A39A"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          placeholderTextColor="#94A39A"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, visibility === 'private' && styles.toggleButtonActive]}
            onPress={() => setVisibility('private')}
          >
            <Text style={[styles.toggleText, visibility === 'private' && styles.toggleTextActive]}>Private</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, visibility === 'public' && styles.toggleButtonActive]}
            onPress={() => setVisibility('public')}
          >
            <Text style={[styles.toggleText, visibility === 'public' && styles.toggleTextActive]}>Public</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={handleCreate} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Create group'}</Text>
        </TouchableOpacity>
      </View>
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
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F5F8F4',
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    color: colors.text,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#FFFFFF',
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
