import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { colors } from '../theme/colors';
import { supabase, supabaseConfigDebug } from '../lib/supabase';
import { DEV_BYPASS_ENABLED } from '../lib/devSession';

async function ensureProfile(userId: string, fullName: string | null) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) return;

  const { error } = await supabase
    .from('profiles')
    .insert({ id: userId, full_name: fullName ?? null });
  if (error) console.warn('ensureProfile: insert failed', error.message);
}

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_up');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'sign_up') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await ensureProfile(data.user.id, fullName);
        }

        Alert.alert('Check your email', 'Your account was created. Confirm your email to continue if required.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          await ensureProfile(data.user.id, null);
        }
      }
    } catch (error: any) {
      Alert.alert('Auth error', error.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenShell
      title="Welcome to One in Prayer"
      subtitle="Create your account to join prayer goals, Catholic daily life, and community prayer."
    >
      <View style={styles.card}>
        <Text style={styles.title}>{mode === 'sign_up' ? 'Create account' : 'Sign in'}</Text>

        {DEV_BYPASS_ENABLED ? (
          <View style={styles.devNotice}>
            <Text style={styles.devNoticeText}>Dev bypass is enabled. The app will treat you as signed in for testing.</Text>
          </View>
        ) : null}

        <View style={styles.devNotice}>
          <Text style={styles.devNoticeText}>
            Runtime config → URL: {supabaseConfigDebug.urlHost} · key: {supabaseConfigDebug.anonKeyPrefix}...
          </Text>
        </View>

        {mode === 'sign_up' ? (
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#94A39A"
            value={fullName}
            onChangeText={setFullName}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A39A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94A39A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Please wait...' : mode === 'sign_up' ? 'Create account' : 'Sign in'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'sign_up' ? 'sign_in' : 'sign_up')}>
          <Text style={styles.switchText}>
            {mode === 'sign_up' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </Text>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
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
  switchText: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '700',
  },
  devNotice: {
    backgroundColor: '#EDF4ED',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  devNoticeText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
});
