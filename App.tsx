import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from './src/components/ScreenShell';
import { SectionCard } from './src/components/SectionCard';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const rosaryHero = require('./assets/rosary-hero.png');
const candleHero = require('./assets/candle-hero.png');
const stainedGlass = require('./assets/stained-glass.png');

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
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

function HomeScreen() {
  return (
    <ScreenShell
      title="Pray together with peace, beauty, and daily rhythm."
      subtitle="A Catholic prayer home built around missions, groups, and the rhythm of the Church."
    >
      <ImageBackground source={rosaryHero} imageStyle={styles.heroImage} style={styles.heroWrap}>
        <LinearGradient colors={['rgba(16,28,18,0.18)', 'rgba(16,28,18,0.62)']} style={styles.heroOverlay}>
          <View style={styles.heroBadgeDark}>
            <Text style={styles.heroBadgeDarkText}>Today in the Church</Text>
          </View>
          <Text style={styles.heroTitleLight}>Feast of the Immaculate Heart of Mary</Text>
          <Text style={styles.heroBodyLight}>
            Gather your family, parish, or friends around one prayer mission and stay rooted in the life of the Church each day.
          </Text>

          <View style={styles.quoteCardDark}>
            <Text style={styles.quoteLabelLight}>Today’s reflection</Text>
            <Text style={styles.quoteTextLight}>
              “The Rosary is the prayer that accompanies me always.”
            </Text>
            <Text style={styles.quoteAuthorLight}>— St. John Paul II</Text>
          </View>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity style={styles.primaryButtonCream}>
              <Text style={styles.primaryButtonCreamText}>Join Mission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostButtonDark}>
              <Text style={styles.ghostButtonDarkText}>Share</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catholic today</Text>
          <Text style={styles.sectionLink}>Open calendar</Text>
        </View>
        {liturgyCards.map((card) => (
          <SectionCard key={card.label} label={card.label} title={card.value} />
        ))}
      </View>

      <ImageBackground source={candleHero} imageStyle={styles.secondaryImage} style={styles.secondaryFeatureWrap}>
        <LinearGradient colors={['rgba(250,252,249,0.88)', 'rgba(250,252,249,0.95)']} style={styles.secondaryFeatureOverlay}>
          <Text style={styles.featureTitle}>Prayer atmosphere</Text>
          <Text style={styles.featureValue}>A calmer, more sacred home experience</Text>
          <Text style={styles.featureBody}>
            Gentle visual atmosphere, living missions, and devotional cues make the app feel less like a utility and more like a prayer space.
          </Text>
        </LinearGradient>
      </ImageBackground>

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
        <SectionCard
          title="Prayer requests"
          support="Ask for prayer, receive support, and update others when prayers are answered."
        />
        <SectionCard
          title="Groups"
          support="Family, parish, and youth circles with recurring missions and reminders."
        />
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
      <SectionCard
        title="Create a mission"
        support="Start a prayer target for family, parish, school, or a special intention."
      />
    </ScreenShell>
  );
}

function GroupsScreen() {
  return (
    <ScreenShell
      title="Groups"
      subtitle="Private circles and parish communities where prayer becomes shared and consistent."
    >
      <SectionCard label="Family Prayer Circle" title="12 members · 3 active missions" />
      <SectionCard label="St Mary Parish" title="240 members · Rosary this week" />
    </ScreenShell>
  );
}

function TodayScreen() {
  return (
    <ScreenShell
      title="Today in the Church"
      subtitle="Daily liturgical context, saints, feasts, and prayer prompts that keep people returning."
    >
      <ImageBackground source={stainedGlass} imageStyle={styles.featureImage} style={styles.featureImageWrap}>
        <LinearGradient colors={['rgba(18,26,20,0.18)', 'rgba(18,26,20,0.58)']} style={styles.featureImageOverlay}>
          <Text style={styles.featureTitleLight}>Saint of the day</Text>
          <Text style={styles.featureValueLight}>St. Irenaeus</Text>
          <Text style={styles.featureBodyLight}>Bishop, martyr, and defender of the faith — presented in a more editorial Catholic style.</Text>
        </LinearGradient>
      </ImageBackground>

      <SectionCard
        label="Feast / Memorial"
        title="Memorial of St. Irenaeus"
        support="Patron of unity, doctrine, and fidelity to the apostolic faith."
      />
      <SectionCard
        label="Liturgical color"
        title="Red"
        support="A day marked by witness, sacrifice, and love poured out in fidelity."
      />
      <SectionCard
        label="Suggested prayer"
        title="Offer 10 Hail Marys for unity in the Church"
        support="A simple daily action that connects liturgical life with communal prayer practice."
      />

      <ImageBackground source={candleHero} imageStyle={styles.secondaryImage} style={styles.secondaryFeatureWrap}>
        <LinearGradient colors={['rgba(250,252,249,0.88)', 'rgba(250,252,249,0.96)']} style={styles.secondaryFeatureOverlay}>
          <Text style={styles.featureTitle}>Coming next</Text>
          <Text style={styles.featureValue}>Feasts, saints, novenas, and daily Catholic moments</Text>
          <Text style={styles.featureBody}>This screen is becoming the retention engine of the app.</Text>
        </LinearGradient>
      </ImageBackground>
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
          tabBarActiveTintColor: colors.primary,
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
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionLink: {
    color: colors.primary,
    fontWeight: '700',
  },
  heroWrap: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 30,
  },
  heroOverlay: {
    padding: 22,
    gap: 14,
    minHeight: 420,
    justifyContent: 'flex-end',
  },
  heroBadgeDark: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroBadgeDarkText: {
    color: '#F7F7F2',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroTitleLight: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  heroBodyLight: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 16,
    lineHeight: 24,
  },
  quoteCardDark: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    gap: 6,
  },
  quoteLabelLight: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quoteTextLight: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  quoteAuthorLight: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButtonCream: {
    flex: 1,
    backgroundColor: 'rgba(255,250,244,0.96)',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonCreamText: {
    color: '#243126',
    fontSize: 15,
    fontWeight: '800',
  },
  ghostButtonDark: {
    minWidth: 96,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  ghostButtonDarkText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryFeatureWrap: {
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 220,
  },
  secondaryImage: {
    borderRadius: 28,
  },
  secondaryFeatureOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    gap: 8,
  },
  missionCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
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
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  missionPillText: {
    color: colors.primary,
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
  featureCard: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DDE8DD',
    gap: 8,
  },
  featureTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  featureValue: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  featureBody: {
    color: '#5F6E63',
    fontSize: 15,
    lineHeight: 22,
  },
  featureImageWrap: {
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 280,
  },
  featureImage: {
    borderRadius: 28,
  },
  featureImageOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    gap: 8,
  },
  featureTitleLight: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  featureValueLight: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  featureBodyLight: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    lineHeight: 22,
  },
});
