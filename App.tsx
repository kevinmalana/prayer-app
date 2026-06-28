import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const missions = [
  { title: '1,000 Hail Marys for Peace', progress: '684 / 1,000', accent: '#F59E0B' },
  { title: 'Family Rosary This Week', progress: '42 / 70', accent: '#7C3AED' },
];

const groups = ['St Mary Parish', 'Family Prayer Circle', 'Youth Rosary'];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Today in the Church</Text>
          <Text style={styles.heroTitle}>Feast of the Immaculate Heart of Mary</Text>
          <Text style={styles.heroText}>
            Pray with others, track your mission, and stay rooted in the rhythm of the Church.
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Join Today’s Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Share to WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Missions</Text>
            <Text style={styles.sectionLink}>See all</Text>
          </View>
          {missions.map((mission) => (
            <View key={mission.title} style={styles.missionCard}>
              <View style={[styles.missionAccent, { backgroundColor: mission.accent }]} />
              <View style={styles.missionBody}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionMeta}>{mission.progress}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { backgroundColor: mission.accent, width: mission.title.includes('1,000') ? '68%' : '60%' }]} />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <Text style={styles.sectionLink}>Create</Text>
          </View>
          <View style={styles.groupGrid}>
            {groups.map((group) => (
              <View key={group} style={styles.groupPill}>
                <Text style={styles.groupPillText}>{group}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>🙏</Text>
              <Text style={styles.actionLabel}>Create Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>📅</Text>
              <Text style={styles.actionLabel}>Catholic Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionEmoji}>💬</Text>
              <Text style={styles.actionLabel}>Prayer Requests</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 28,
    padding: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  kicker: {
    color: '#C4B5FD',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#F8FAFC',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  heroText: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
  },
  heroActions: {
    marginTop: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#111827',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontWeight: '700',
    fontSize: 15,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 21,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#C4B5FD',
    fontWeight: '700',
  },
  missionCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 22,
    overflow: 'hidden',
  },
  missionAccent: {
    width: 8,
  },
  missionBody: {
    flex: 1,
    padding: 18,
    gap: 8,
  },
  missionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  missionMeta: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#334155',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  groupPill: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  groupPillText: {
    color: '#E2E8F0',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 10,
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionLabel: {
    color: '#E2E8F0',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 13,
  },
});
