import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8FBF7',
    card: '#FFFFFF',
    text: '#223127',
    border: '#E4ECE4',
    primary: '#5E8C61',
  },
};

function ScreenShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.topLabel}>Prayer App</Text>
        <Text style={styles.topTitle}>{title}</Text>
        <Text style={styles.topSubtitle}>{subtitle}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeScreen() {
  const todayCards = [
    { label: 'Saint of the Day', value: 'St. Irenaeus' },
    { label: 'Liturgical Season', value: 'Ordinary Time' },
    { label: 'Rosary Mystery', value: 'Glorious Mysteries' },
  ];

  const missions = [
    { title: '1,000 Hail Marys for Peace', progress: '684 / 1,000', pill: '68% complete' },
    { title: 'Family Rosary This Week', progress: '42 / 70', pill: 'Daily mission' },
  ];

  return (
    <ScreenShell
      title="Pray together with peace, beauty, and daily rhythm."
      subtitle="A Catholic prayer home built around missions, groups, and the rhythm of the Church."
    >
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
    </ScreenShell>
  );
}

function MissionsScreen() {
  return (
    <ScreenShell
      title="Prayer missions"
      subtitle="Join targets, pray with others, and help your group reach spiritual goals."
    >
      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>Featured mission</Text>
        <Text style={styles.featureValue}>10,000 Hail Marys for peace in families</Text>
        <Text style={styles.featureBody}>Public prayer targets will live here, with filters, progress, and quick join actions.</Text>
      </View>
      <View style={styles.actionCard}>
        <Text style={styles.actionTitle}>Create a mission</Text>
        <Text style={styles.actionText}>Start a prayer target for family, parish, school, or a special intention.</Text>
      </View>
    </ScreenShell>
  );
}

function GroupsScreen() {
  return (
    <ScreenShell
      title="Groups"
      subtitle="Private circles and parish communities where prayer becomes shared and consistent."
    >
      <View style={styles.softCard}>
        <Text style={styles.cardLabel}>Family Prayer Circle</Text>
        <Text style={styles.cardValue}>12 members · 3 active missions</Text>
      </View>
      <View style={styles.softCard}>
        <Text style={styles.cardLabel}>St Mary Parish</Text>
        <Text style={styles.cardValue}>240 members · Rosary this week</Text>
      </View>
    </ScreenShell>
  );
}

function TodayScreen() {
  return (
    <ScreenShell
      title="Today in the Church"
      subtitle="Daily liturgical context, saints, feasts, and prayer prompts that keep people returning."
    >
      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>Saint of the day</Text>
        <Text style={styles.featureValue}>St. Irenaeus</Text>
        <Text style={styles.featureBody}>Bishop, martyr, and defender of the faith. This tab will become the Catholic daily engine of the app.</Text>
      </View>
      <View style={styles.softCard}>
        <Text style={styles.cardLabel}>Suggested action</Text>
        <Text style={styles.cardValue}>Offer 10 Hail Marys for unity in the Church</Text>
      </View>
    </ScreenShell>
  );
}

function ProfileScreen() {
  return (
    <ScreenShell
      title="Profile"
      subtitle="Your prayer rhythm, contribution history, streaks, and future reminders will live here."
    >
      <View style={styles.featureCard}>
        <Text style={styles.featureTitle}>Current streak</Text>
        <Text style={styles.featureValue}>6 days</Text>
        <Text style={styles.featureBody}>A gentle progress area for completed missions, group activity, and personal prayer momentum.</Text>
      </View>
    </ScreenShell>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#5E8C61',
          tabBarInactiveTintColor: '#8B998F',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E4ECE4',
            height: 72,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Missions" component={MissionsScreen} />
        <Tab.Screen name="Groups" component={GroupsScreen} />
        <Tab.Screen name="Today" component={TodayScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FBF7',
  },
  content: {
    padding: 22,
    paddingBottom: 110,
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
  topSubtitle: {
    color: '#5F6E63',
    fontSize: 15,
    lineHeight: 22,
    marginTop: -8,
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
  featureCard: {
    backgroundColor: '#EEF5EE',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDE9DE',
    gap: 8,
  },
  featureTitle: {
    color: '#5E8C61',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  featureValue: {
    color: '#223127',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  featureBody: {
    color: '#5F6E63',
    fontSize: 15,
    lineHeight: 22,
  },
});
