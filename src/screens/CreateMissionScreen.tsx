import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';

export function CreateMissionScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [intention, setIntention] = useState('');
  const [target, setTarget] = useState('1000');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a prayer goal title.');
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
      const { error } = await supabase.from('missions').insert({
        title,
        intention: intention || null,
        prayer_type: 'hail_mary',
        target_count: Number(target) || 1000,
        creator_id: user.id,
      });

      if (error) throw error;

      Alert.alert('Prayer Goal created', 'Your prayer goal has been created.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Create failed', error.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell
      title="Create Prayer Goal"
      subtitle="Set a prayer goal, attach an intention, and share it with others."
    >
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Prayer goal title"
          placeholderTextColor="#94A39A"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Intention"
          placeholderTextColor="#94A39A"
          value={intention}
          onChangeText={setIntention}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Target count"
          placeholderTextColor="#94A39A"
          value={target}
          onChangeText={setTarget}
          keyboardType="number-pad"
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleCreate} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Creating...' : 'Create prayer goal'}</Text>
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
