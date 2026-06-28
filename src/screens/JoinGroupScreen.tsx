import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function JoinGroupScreen({ navigation }: any) {
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

  return (
    <ScreenShell title="Join Group" subtitle="Join a prayer group using its ID for now.">
      <View style={styles.card}>
        <Text style={styles.helpText}>Temporary flow: paste a prayer group ID shared by another user.</Text>
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
