import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';

export function MissionsHubScreen() {
  return (
    <ScreenShell
      title="Prayer missions"
      subtitle="Create a mission, contribute instantly, and keep the whole community moving together."
    >
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Create mission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Open featured</Text>
        </TouchableOpacity>
      </View>

      <SectionCard
        label="Featured mission"
        title="1,000 Hail Marys for peace in families"
        support="684 completed · 316 remaining · Deadline Sunday 9PM"
      />

      <SectionCard
        label="For parish groups"
        title="Monthly rosary target"
        support="Use recurring missions for parishes, youth groups, and family circles."
      />

      <SectionCard
        label="For urgent needs"
        title="24-hour prayer chain"
        support="A fast communal response flow for illness, grief, exams, travel, or emergencies."
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#EEF4EE',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
});
