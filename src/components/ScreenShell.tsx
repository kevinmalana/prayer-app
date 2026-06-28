import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function ScreenShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.topLabel}>One in Prayer</Text>
          <Text style={styles.topTitle}>{title}</Text>
          <Text style={styles.topSubtitle}>{subtitle}</Text>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 22,
    paddingBottom: 120,
    gap: 22,
  },
  headerBlock: {
    gap: 8,
  },
  topLabel: {
    color: '#708573',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  topTitle: {
    color: colors.text,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
  },
  topSubtitle: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
  },
});
