import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function SectionCard({
  label,
  title,
  support,
  children,
}: {
  label?: string;
  title: string;
  support?: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {support ? <Text style={styles.support}>{support}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: '#314332',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    gap: 6,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    color: '#29362C',
    fontSize: 19,
    fontWeight: '700',
  },
  support: {
    color: '#6E7A70',
    fontSize: 14,
    lineHeight: 20,
  },
});
