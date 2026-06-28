import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';

export function MissionDetailScreen() {
  return (
    <ScreenShell
      title="Mission detail"
      subtitle="This is the core experience: a shared intention, visible progress, and quick contribution."
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Featured mission</Text>
        <Text style={styles.heroTitle}>1,000 Hail Marys for peace in families</Text>
        <Text style={styles.heroText}>Join a visible communal target and contribute a small prayer count in seconds.</Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '68%' }]} />
        </View>
        <Text style={styles.progressMeta}>684 / 1,000 completed</Text>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.countButton}><Text style={styles.countButtonText}>+1</Text></TouchableOpacity>
        <TouchableOpacity style={styles.countButton}><Text style={styles.countButtonText}>+5</Text></TouchableOpacity>
        <TouchableOpacity style={styles.countButton}><Text style={styles.countButtonText}>+10</Text></TouchableOpacity>
        <TouchableOpacity style={styles.countButton}><Text style={styles.countButtonText}>+20</Text></TouchableOpacity>
      </View>

      <SectionCard
        label="Intention"
        title="Pray for peace, healing, and stronger Catholic families"
        support="Mission intentions should be short, clear, and emotionally strong."
      />

      <SectionCard
        label="Community activity"
        title="Maria added 10 · Joseph added 5 · Parish group invited 12 more people"
        support="This area will become a live contribution feed from Supabase."
      />

      <SectionCard
        label="Comments & support"
        title="Praying for all families in difficulty today"
        support="This section will hold encouragement, comments, and testimony updates."
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 10,
  },
  heroLabel: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },
  heroText: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#E4ECE4',
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6F9B72',
  },
  progressMeta: {
    color: '#6E7A70',
    fontWeight: '700',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  countButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
