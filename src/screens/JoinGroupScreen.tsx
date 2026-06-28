import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { AuthGateCard } from '../components/AuthGateCard';

export function JoinGroupScreen({ navigation }: any) {
  const { session, loading: sessionLoading } = useSession();
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
      navigation.navigate('Auth');
      return;
    }

    if (!groupId.trim()) {
      Alert.alert('Missing group ID', 'Paste the group ID to join.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('group_members').insert({
        group_id: groupId.trim(),
        user_id: user.id,
      });

      if (error) throw error;

      Alert.alert('Joined group', 'You have joined the prayer group.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Join failed', error.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <ScreenShell title="Join Group" subtitle="Checking your account…">
        <View />
      </ScreenShell>
    );
  }

  if (!session) {
    return (
      <ScreenShell title="Join Group" subtitle="Sign in before joining a prayer group.">
        <AuthGateCard
          title="Join groups with an account"
          body="Signing in connects your membership, contributions, and group activity to your profile instead of dropping you into a dead-end form."
          onPress={() => navigation.navigate('Auth')}
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Join Group" subtitle="Enter a prayer group ID to join.">
      <View style={styles.card}>
        <Text style={styles.helpText}>Paste a prayer group ID shared by another member to join their group.</Text>
        <TextInput
          style={styles.input}
          placeholder="Group ID"
          placeholderTextColor="#94A39A"
          value={groupId}
          onChangeText={setGroupId}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleJoin} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Joining...' : 'Join group'}</Text>
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
  helpText: {
    color: colors.textSoft,
    lineHeight: 20,
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
