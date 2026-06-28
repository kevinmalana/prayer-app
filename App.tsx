import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useSession } from './src/hooks/useSession';

import { ScreenShell } from './src/components/ScreenShell';
import { SectionCard } from './src/components/SectionCard';
import { colors } from './src/theme/colors';
import { TodayScreen } from './src/screens/TodayScreen';
import { MissionsHubScreen } from './src/screens/MissionsHubScreen';
import { GroupsHubScreen } from './src/screens/GroupsHubScreen';
import { ProfileHubScreen } from './src/screens/ProfileHubScreen';
import { MissionDetailScreen } from './src/screens/MissionDetailScreen';
import { CreateMissionScreen } from './src/screens/CreateMissionScreen';
import { CreateGroupScreen } from './src/screens/CreateGroupScreen';
import { JoinGroupScreen } from './src/screens/JoinGroupScreen';
import { GroupDetailScreen } from './src/screens/GroupDetailScreen';
import { PrayerRequestsScreen } from './src/screens/PrayerRequestsScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { MissionProvider, useMissions } from './src/context/MissionContext';
import { fetchLiturgicalDay, getFallbackLiturgicalDay, LiturgicalDay } from './src/lib/liturgical';
import { LiturgicalCalendarScreen } from './src/screens/LiturgicalCalendarScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

const rosaryHero = require('./assets/rosary-hero.png');
const candleHero = require('./assets/candle-hero.png');

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

function HomeScreen({ navigation }: any) {
  const { missions, loading: loadingMissions, error } = useMissions();
  const [liturgy, setLiturgy] = useState<LiturgicalDay>(getFallbackLiturgicalDay());

  useEffect(() => {
    let active = true;

    fetchLiturgicalDay().then((day) => {
      if (active) {
        setLiturgy(day);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const latestMission = missions[0];
  const remainingMissions = missions.slice(1);
  const liturgyCards = [
    { label: 'Celebration', value: liturgy.celebrationName },
    { label: 'Liturgical Season', value: liturgy.season },
    { label: 'Rosary Mystery', value: liturgy.rosaryMystery },
  ];

  return (
    <ScreenShell
      title={liturgy.celebrationName}
      subtitle={`${liturgy.season} · ${liturgy.rosaryMystery}`}
    >
      <ImageBackground source={rosaryHero} imageStyle={styles.heroImage} style={styles.heroWrap}>
        <LinearGradient colors={['rgba(16,28,18,0.18)', 'rgba(16,28,18,0.62)']} style={styles.heroOverlay}>
          <View style={styles.heroBadgeDark}>
            <Text style={styles.heroBadgeDarkText}>Today in the Church</Text>
          </View>
          <Text style={styles.heroTitleLight}>{liturgy.celebrationName}</Text>
          <Text style={styles.heroBodyLight}>
            {liturgy.description || `${liturgy.season} observed today in the Church.`}
          </Text>

          <View style={styles.quoteCardDark}>
            <Text style={styles.quoteLabelLight}>Today's celebration</Text>
            <Text style={styles.quoteTextLight}>
              {liturgy.quote ? `"${liturgy.quote}"` : liturgy.description || 'Daily Catholic rhythm grounded in prayer and the Church calendar.'}
            </Text>
            <Text style={styles.quoteAuthorLight}>— {liturgy.celebrationType}</Text>
          </View>

          <View style={styles.heroButtonRow}>
            <TouchableOpacity
              style={styles.primaryButtonCream}
              onPress={() => navigation.navigate('MissionDetail', latestMission ? { missionId: latestMission.id } : undefined)}
            >
              <Text style={styles.primaryButtonCreamText}>{latestMission ? 'Open Goal' : 'No goals yet'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostButtonDark} onPress={() => navigation.navigate('CreateMission')}>
              <Text style={styles.ghostButtonDarkText}>Create</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catholic today</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LiturgicalCalendar')}>
            <Text style={styles.sectionLink}>Open calendar</Text>
          </TouchableOpacity>
        </View>
        {liturgyCards.map((card) => (
          <SectionCard key={card.label} label={card.label} title={card.value} />
        ))}
      </View>

      <ImageBackground source={candleHero} imageStyle={styles.secondaryImage} style={styles.secondaryFeatureWrap}>
        <LinearGradient colors={['rgba(250,252,249,0.88)', 'rgba(250,252,249,0.95)']} style={styles.secondaryFeatureOverlay}>
          <Text style={styles.featureTitle}>Celebration type</Text>
          <Text style={styles.featureValue}>{liturgy.celebrationType}</Text>
          <Text style={styles.featureBody}>
            {liturgy.description || `${liturgy.season} is observed in the Church today.`}
          </Text>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Prayer goals</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        {loadingMissions ? (
          <ActivityIndicator color={colors.primary} />
        ) : error ? (
          <SectionCard
            label="Connection issue"
            title="Could not load prayer goals"
            support={error}
          />
        ) : missions.length === 0 ? (
          <SectionCard
            label="Start praying"
            title="Create your first prayer goal"
            support="Set a communal target for Hail Marys, decades, or rosaries."
          />
        ) : (
          remainingMissions.map((mission) => {
            const pct = Math.min(100, Math.round((mission.current_count / Math.max(mission.target_count, 1)) * 100));
            return (
              <TouchableOpacity
                key={mission.id}
                style={styles.missionCard}
                onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}
              >
                <View style={styles.missionHeader}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <View style={styles.missionPill}>
                    <Text style={styles.missionPillText}>{pct}% complete</Text>
                  </View>
                </View>
                <Text style={styles.missionMeta}>{mission.current_count} / {mission.target_count}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.dualRow}>
        <SectionCard
          title="Prayer requests"
          support="Open requests shared by the community appear here once they are posted."
        />
        <SectionCard
          title="Groups"
          support="Real family, parish, and ministry groups appear here from your live data."
        />
      </View>
    </ScreenShell>
  );
}

function MainTabs() {
  const { session } = useSession();
  const isSignedIn = Boolean(session);

  return (
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
      <Tab.Screen name="Goals" component={MissionsHubScreen} />
      <Tab.Screen name="Groups" component={GroupsHubScreen} />
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarBadge: isSignedIn ? undefined : '!',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileHubScreen}
        options={{
          tabBarBadge: isSignedIn ? undefined : '!',
        }}
      />
    </Tab.Navigator>
  );
}

function getTabIcon(routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Goals':
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
    <MissionProvider>
    <NavigationContainer theme={theme}>
      <RootStack.Navigator>
        <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <RootStack.Screen
          name="MissionDetail"
          component={MissionDetailScreen}
          options={{ title: 'Prayer Goal' }}
        />
        <RootStack.Screen
          name="CreateMission"
          component={CreateMissionScreen}
          options={{ title: 'Create Prayer Goal' }}
        />
        <RootStack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Account' }}
        />
        <RootStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Create Group' }} />
        <RootStack.Screen name="JoinGroup" component={JoinGroupScreen} options={{ title: 'Join Group' }} />
        <RootStack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ title: 'Group Detail' }} />
        <RootStack.Screen name="PrayerRequests" component={PrayerRequestsScreen} options={{ title: 'Prayer Requests' }} />
        <RootStack.Screen name="LiturgicalCalendar" component={LiturgicalCalendarScreen} options={{ title: 'Liturgical Calendar' }} />
      </RootStack.Navigator>
    </NavigationContainer>
    </MissionProvider>
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
});
