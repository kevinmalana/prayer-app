import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const missions = [
  { title: '1,000 Hail Marys for Peace', progress: '684 / 1,000', pill: '68% complete' },
  { title: 'Family Rosary This Week', progress: '42 / 70', pill: 'Daily mission' },
];

const todayCards = [
  { label: 'Saint of the Day', value: 'St. Irenaeus' },
  { label: 'Liturgical Season', value: 'Ordinary Time' },
  { label: 'Rosary Mystery', value: 'Glorious Mysteries' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.topLabel}>Prayer App</Text>
        <Text style={styles.topTitle}>Pray together with peace, beauty, and daily rhythm.</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>Today in the Church</Text>
          <Text style={styles.heroTitle}>Feast of the Immaculate Heart of Mary</Text>
          <Text style={styles.heroBody}>
            Gather your family, parish, or friends around one prayer mission and stay connected to the life of the Church each day.
          </Text>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Join Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {todayCards.map((card) => (
            <View key={card.label} style={styles.softCard}>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prayer Missions</Text>
            <Text style={styles.sectionLink}>See all</Text>
          </View>

          {missions.map((mission) => (
            <View key={mission.title} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <View style={styles.missionPill}>
                  <Text style={styles.missionPillText}>{mission.pill}</Text>
                </View>
              </View>
              <Text style={styles.missionMeta}>{mission.progress}</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: mission.title.includes('1,000') ? '68%' : '60%' },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>Create a mission</Text>
              <Text style={styles.actionText}>Start a prayer target for family or parish.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionTitle}>Prayer requests</Text>
              <Text style={styles.actionText}>Ask others to pray and track support.</Text>
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
    backgroundColor: '#F8FBF7',
  },
  content: {
    padding: 22,
    paddingBottom: 40,
    gap: 22,
  },
  topLabel: {
    color: '#6F8B72',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  topTitle: {
    color: '#223127',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
  },
  heroCard: {
    backgroundColor: '#EEF5EE',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#DDE9DE',
  },
  heroKicker: {
    color: '#5E8C61',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroTitle: {
    color: '#223127',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroBody: {
    color: '#5F6E63',
    fontSize: 16,
    lineHeight: 24,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#5E8C61',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ghostButton: {
    minWidth: 96,
    backgroundColor: '#F6FAF6',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE9DE',
  },
  ghostButtonText: {
    color: '#4B6A4E',
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#223127',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#5E8C61',
    fontWeight: '700',
  },
  softCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4ECE4',
  },
  cardLabel: {
    color: '#8B998F',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardValue: {
    color: '#2A372E',
    fontSize: 19,
    fontWeight: '700',
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4ECE4',
    gap: 10,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  missionTitle: {
    flex: 1,
    color: '#2A372E',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  missionPill: {
    backgroundColor: '#ECF4EC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  missionPillText: {
    color: '#5E8C61',
    fontSize: 12,
    fontWeight: '700',
  },
  missionMeta: {
    color: '#7C8A80',
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E4ECE4',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#6F9B72',
  },
  actionGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4ECE4',
    gap: 6,
  },
  actionTitle: {
    color: '#2A372E',
    fontSize: 17,
    fontWeight: '700',
  },
  actionText: {
    color: '#6F7A72',
    fontSize: 14,
    lineHeight: 20,
  },
});
