import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7FAF6',
    card: '#FFFFFF',
    text: '#223127',
    border: '#DFE8DF',
    primary: '#567A5A',
  },
};

const homeMissions = [
  { title: '1,000 Hail Marys for Peace', progress: '684 / 1,000', pill: '68% complete' },
  { title: 'Family Rosary This Week', progress: '42 / 70', pill: 'Daily mission' },
];

const liturgyCards = [
  { label: 'Saint of the Day', value: 'St. Irenaeus' },
  { label: 'Liturgical Season', value: 'Ordinary Time' },
  { label: 'Rosary Mystery', value: 'Glorious Mysteries' },
];

function ScreenShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.topLabel}>Prayer App</Text>
          <Text style={styles.topTitle}>{title}</Text>
          <Text style={styles.topSubtitle}>{subtitle}</Text>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeScreen() {
  return (
    <ScreenShell
      title="Pray together with peace, beauty, and daily rhythm."
      subtitle="A Catholic prayer home built around missions, groups, and the rhythm of the Church."
    >
      <LinearGradient colors={['#F2F7F1', '#E4EFE4']} style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Today in the Church</Text>
        </View>
        <Text style={styles.heroTitle}>Feast of the Immaculate Heart of Mary</Text>
        <Text style={styles.heroBody}>
          Gather your family, parish, or friends around one prayer mission and stay rooted in the life of the Church each day.
        </Text>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>Today’s reflection</Text>
          <Text style={styles.quoteText}>
            “The Rosary is the prayer that accompanies me always.”
          </Text>
          <Text style={styles.quoteAuthor}>— St. John Paul II</Text>
        </View>

        <View style={styles.heroButtonRow}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Join Mission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton}>
            <Text style={styles.ghostButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catholic today</Text>
          <Text style={styles.sectionLink}>Open calendar</Text>
        </View>
        {liturgyCards.map((card) => (
          <View key={card.label} style={styles.softCard}>
            <Text style={styles.cardLabel}>{card.label}</Text>
            <Text style={styles.cardValue}>{card.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prayer missions</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        {homeMissions.map((mission) => (
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

      <View style={styles.dualRow}>
        <View style={[styles.premiumCard, styles.flexCard]}>
          <Text style={styles.premiumTitle}>Prayer requests</Text>
          <Text style={styles.premiumText}>Ask for prayer, receive support, and update others when prayers are answered.</Text>
        </View>
        <View style={[styles.premiumCard, styles.flexCard]}>
          <Text style={styles.premiumTitle}>Groups</Text>
          <Text style={styles.premiumText}>Family, parish, and youth circles with recurring missions and reminders.</Text>
        </View>
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
      <LinearGradient colors={['#F2F7F1', '#E6EFE5']} style={styles.featureCard}>
        <Text style={styles.featureTitle}>Featured mission</Text>
        <Text style={styles.featureValue}>10,000 Hail Marys for peace in families</Text>
        <Text style={styles.featureBody}>Mission cards will become richer with intentions, deadlines, contributors, and milestones.</Text>
      </LinearGradient>
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
      <LinearGradient colors={['#F5F8F4', '#EAF2E8']} style={styles.featureCard}>
        <Text style={styles.featureTitle}>Saint of the day</Text>
        <Text style={styles.featureValue}>St. Irenaeus</Text>
        <Text style={styles.featureBody}>Bishop, martyr, and defender of the faith. This screen should feel like a daily Catholic editorial brief, not a generic utility app.</Text>
      </LinearGradient>

      <View style={styles.softCard}> 
        <Text style={styles.cardLabel}>Feast / Memorial</Text>
        <Text style={styles.cardValue}>Memorial of St. Irenaeus</Text>
        <Text style={styles.cardSupport}>Patron of unity, doctrine, and fidelity to the apostolic faith.</Text>
      </View>

      <View style={styles.softCard}>
        <Text style={styles.cardLabel}>Liturgical color</Text>
        <Text style={styles.cardValue}>Red</Text>
        <Text style={styles.cardSupport}>A day marked by witness, sacrifice, and love poured out in fidelity.</Text>
      </View>

      <View style={styles.softCard}>
        <Text style={styles.cardLabel}>Suggested prayer</Text>
        <Text style={styles.cardValue}>Offer 10 Hail Marys for unity in the Church</Text>
        <Text style={styles.cardSupport}>A simple daily action that connects liturgical life with communal prayer practice.</Text>
      </View>

      <View style={styles.softCard}>
        <Text style={styles.cardLabel}>Coming next</Text>
        <Text style={styles.cardValue}>Feasts, saints, novenas, and daily Catholic moments</Text>
        <Text style={styles.cardSupport}>This screen will become the retention engine of the app.</Text>
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
      <LinearGradient colors={['#F5F8F4', '#E9F1E8']} style={styles.featureCard}>
        <Text style={styles.featureTitle}>Current streak</Text>
        <Text style={styles.featureValue}>6 days</Text>
        <Text style={styles.featureBody}>A gentler profile area for your contribution history, prayer rhythm, and reminders.</Text>
      </LinearGradient>
    </ScreenShell>
  );
}

function getTabIcon(routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Missions':
      return focused ? 'sparkles' : 'sparkles-outline';
    case 'Groups':
      return focused ? 'people' : 'people-outline';
    case 'Today':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    default:
      return 'ellipse-outline';
  }
}

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#567A5A',
          tabBarInactiveTintColor: '#95A296',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={getTabIcon(route.name, focused)} size={size} color={color} />
          ),
          tabBarStyle: {
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 14,
            height: 72,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: 'rgba(255,255,255,0.96)',
            borderTopColor: '#E1E9E1',
            borderRadius: 24,
            shadowColor: '#324334',
            shadowOpacity: 0.08,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
        })}
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
    backgroundColor: '#F7FAF6',
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
    color: '#223127',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
  },
  topSubtitle: {
    color: '#617064',
    fontSize: 15,
    lineHeight: 22,
  },
  heroCard: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: '#DCE8DC',
    gap: 14,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(86,122,90,0.10)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroBadgeText: {
    color: '#567A5A',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#223127',
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '800',
  },
  heroBody: {
    color: '#5F6E63',
    fontSize: 16,
    lineHeight: 24,
  },
  quoteCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1EAE1',
    gap: 6,
  },
  quoteLabel: {
    color: '#7A8B7D',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quoteText: {
    color: '#2B392E',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  quoteAuthor: {
    color: '#6D7C70',
    fontSize: 14,
    fontWeight: '600',
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#567A5A',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ghostButton: {
    minWidth: 96,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE8DD',
  },
  ghostButtonText: {
    color: '#49664D',
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
    color: '#567A5A',
    fontWeight: '700',
  },
  softCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3EBE3',
    shadowColor: '#314332',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    gap: 4,
  },
  cardLabel: {
    color: '#8C988E',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cardValue: {
    color: '#29362C',
    fontSize: 19,
    fontWeight: '700',
  },
  cardSupport: {
    color: '#6E7A70',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  missionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3EBE3',
    gap: 10,
    shadowColor: '#314332',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
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
    backgroundColor: '#EDF4ED',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  missionPillText: {
    color: '#567A5A',
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
  dualRow: {
    flexDirection: 'row',
    gap: 12,
  },
  premiumCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3EBE3',
    shadowColor: '#314332',
    shadowOpacity: 0.03,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    gap: 8,
  },
  flexCard: {
    flex: 1,
  },
  premiumTitle: {
    color: '#29362C',
    fontSize: 17,
    fontWeight: '800',
  },
  premiumText: {
    color: '#667368',
    fontSize: 14,
    lineHeight: 20,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E3EBE3',
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
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDE8DD',
    gap: 8,
  },
  featureTitle: {
    color: '#567A5A',
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
