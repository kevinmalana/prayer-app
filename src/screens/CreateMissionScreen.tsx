import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';

export function CreateMissionScreen() {
  const [title, setTitle] = useState('');
  const [intention, setIntention] = useState('');
  const [target, setTarget] = useState('1000');

  const handleCreate = () => {
    Alert.alert('Next step', 'This form is ready for Supabase write wiring next.');
  };

  return (
    <ScreenShell
      title="Create mission"
      subtitle="Set a prayer goal, attach an intention, and share it with others."
    >
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Mission title"
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

        <TouchableOpacity style={styles.primaryButton} onPress={handleCreate}>
          <Text style={styles.primaryButtonText}>Create mission</Text>
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
