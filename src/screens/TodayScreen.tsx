import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { useMissions, SharedMission } from '../context/MissionContext';
import { useSession } from '../hooks/useSession';
import { fetchLiturgicalDay, getFallbackLiturgicalDay, LiturgicalDay } from '../lib/liturgical';

interface TodaySummary {
  activeMissions: number;
  totalPrayedToday: number;
  activeGroups: number;
  openRequests: number;
}

export function TodayScreen({ navigation }: any) {
  const { missions } = useMissions();
  const { session, loading: sessionLoading } = useSession();
  const [summary, setSummary] = useState<TodaySummary>({ activeMissions: 0, totalPrayedToday: 0, activeGroups: 0, openRequests: 0 });
  const [liturgy, setLiturgy] = useState<LiturgicalDay>(getFallbackLiturgicalDay());
  const [loading, setLoading] = useState(true);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

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

  useEffect(() => {
    const loadToday = async () => {
      if (!session?.user) {
        setSummary({
          activeMissions: missions.length,
          totalPrayedToday: 0,
          activeGroups: 0,
          openRequests: 0,
        });
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [groupsRes, requestsRes, contributionsRes] = await Promise.all([
          supabase
            .from('group_members')
            .select('group_id', { count: 'exact', head: true })
            .eq('user_id', session.user.id),
          supabase
            .from('prayer_requests')
            .select('id,is_answered,user_id')
            .eq('user_id', session.user.id),
          supabase
            .from('mission_contributions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .gte('created_at', todayStart.toISOString()),
        ]);

        const openRequests = (requestsRes.data ?? []).filter((r) => !r.is_answered);

        setSummary({
          activeMissions: missions.length,
          totalPrayedToday: contributionsRes.count ?? 0,
          activeGroups: groupsRes.count ?? 0,
          openRequests: openRequests.length,
        });
      } catch {
        setSummary({
          activeMissions: missions.length,
          totalPrayedToday: 0,
          activeGroups: 0,
          openRequests: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (!sessionLoading) {
      loadToday();
    }
  }, [missions, session?.user?.id, sessionLoading]);

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <ScreenShell
      title="Today"
      subtitle={`${todayDate} — your daily prayer overview.`}
    >
      {sessionLoading || loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      ) : !session ? (
        <>
          <SectionCard
            label={liturgy.source === 'live' ? 'Today in the Church' : 'Today in the Church · fallback'}
            title={liturgy.celebrationName}
            support={`${liturgy.season} · ${liturgy.rosaryMystery}${liturgy.description ? ` · ${liturgy.description}` : ''}`}
          />

          <SectionCard
            label="Sign in for your daily rhythm"
            title="Your Today tab becomes personal once you're signed in"
            support="Track today's prayers, your groups, and open requests from one place."
          />

          <TouchableOpacity style={styles.authPromptButton} onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.authPromptButtonText}>Sign in or create account</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active prayer goals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
                <Text style={styles.sectionLink}>Browse</Text>
              </TouchableOpacity>
            </View>

            {missions.length === 0 ? (
              <SectionCard
                label="Get started"
                title="No prayer goals yet"
                support="Create a prayer goal after signing in to begin tracking your daily prayers."
              />
            ) : (
              missions.slice(0, 3).map((mission: SharedMission) => {
                const pct = Math.min(
                  100,
                  Math.round((mission.current_count / Math.max(mission.target_count, 1)) * 100),
                );
                return (
                  <TouchableOpacity
                    key={mission.id}
                    style={styles.missionCard}
                    onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}
                  >
                    <View style={styles.missionHeader}>
                      <Text style={styles.missionTitle}>{mission.title}</Text>
                      <View style={styles.missionPill}>
                        <Text style={styles.missionPillText}>{pct}%</Text>
                      </View>
                    </View>
                    <Text style={styles.missionMeta}>
                      {mission.current_count} / {mission.target_count}
                      {mission.intention ? ` · ${mission.intention}` : ''}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${pct}%` }]} />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </>
      ) : (
        <>
          <SectionCard
            label={liturgy.source === 'live' ? 'Today in the Church' : 'Today in the Church · fallback'}
            title={liturgy.celebrationName}
            support={`${liturgy.season} · ${liturgy.rosaryMystery}${liturgy.description ? ` · ${liturgy.description}` : ''}`}
          />

          {/* Daily summary stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="flame-outline" size={20} color="#6F9B72" />
              <Text style={styles.statValue}>{summary.totalPrayedToday}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="sparkles-outline" size={20} color="#6F9B72" />
              <Text style={styles.statValue}>{summary.activeMissions}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={20} color="#6F9B72" />
              <Text style={styles.statValue}>{summary.activeGroups}</Text>
              <Text style={styles.statLabel}>Groups</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart-outline" size={20} color="#6F9B72" />
              <Text style={styles.statValue}>{summary.openRequests}</Text>
              <Text style={styles.statLabel}>Open</Text>
            </View>
          </View>

          {/* Quick-action prompt if nothing is happening today */}
          {summary.totalPrayedToday === 0 ? (
            <SectionCard
              label="Start today"
              title="No prayers logged yet today"
              support="Open a goal below, tap contribute, and begin your daily rhythm."
            />
          ) : null}

          {/* Prayer goals section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active prayer goals</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>

            {missions.length === 0 ? (
              <SectionCard
                label="Get started"
                title="No prayer goals yet"
                support="Create a prayer goal to begin tracking your daily prayers."
              />
            ) : (
              missions.map((mission: SharedMission) => {
                const pct = Math.min(
                  100,
                  Math.round((mission.current_count / Math.max(mission.target_count, 1)) * 100),
                );
                return (
                  <TouchableOpacity
                    key={mission.id}
                    style={styles.missionCard}
                    onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}
                  >
                    <View style={styles.missionHeader}>
                      <Text style={styles.missionTitle}>{mission.title}</Text>
                      <View style={styles.missionPill}>
                        <Text style={styles.missionPillText}>{pct}%</Text>
                      </View>
                    </View>
                    <Text style={styles.missionMeta}>
                      {mission.current_count} / {mission.target_count}
                      {mission.intention ? ` · ${mission.intention}` : ''}
                    </Text>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${pct}%` }]} />
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Quick link to groups */}
          <TouchableOpacity style={styles.promptRow} onPress={() => navigation.navigate('Groups')}>
            <View style={styles.promptIconWrap}>
              <Ionicons name="people-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.promptTextBlock}>
              <Text style={styles.promptTitle}>Prayer groups</Text>
              <Text style={styles.promptSupport}>
                {summary.activeGroups > 0
                  ? `${summary.activeGroups} group${summary.activeGroups === 1 ? '' : 's'} active`
                  : 'Create or join a group to pray together'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B8C4B9" />
          </TouchableOpacity>

          {/* Quick link to requests */}
          <TouchableOpacity style={styles.promptRow} onPress={() => navigation.navigate('PrayerRequests')}>
            <View style={styles.promptIconWrap}>
              <Ionicons name="heart-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.promptTextBlock}>
              <Text style={styles.promptTitle}>Prayer requests</Text>
              <Text style={styles.promptSupport}>
                {summary.openRequests > 0
                  ? `${summary.openRequests} open request${summary.openRequests === 1 ? '' : 's'}`
                  : 'Post a request or pray for others'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B8C4B9" />
          </TouchableOpacity>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: '#2A372E',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#8C988E',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
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
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionLink: {
    color: colors.primary,
    fontWeight: '700',
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
  authPromptButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  authPromptButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  promptIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#EDF4ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTextBlock: {
    flex: 1,
    gap: 2,
  },
  promptTitle: {
    color: '#2A372E',
    fontSize: 16,
    fontWeight: '700',
  },
  promptSupport: {
    color: '#8C988E',
    fontSize: 13,
    lineHeight: 18,
  },
});