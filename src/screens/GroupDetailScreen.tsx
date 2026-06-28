import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import type { Mission, PrayerRequest } from '../types/domain';

interface TestimonyRow {
  id: string;
  title: string;
  body: string;
  prayer_request_id: string | null;
  user_id: string;
  created_at: string;
}

interface GroupDetail {
  id: string;
  name: string;
  description: string | null;
  type: string;
  visibility: 'private' | 'public';
  join_mode: string;
  owner_id: string;
  created_at: string;
}

interface GroupMemberRow {
  user_id: string;
  role: string;
}

interface ContributionRow {
  id: string;
  mission_id: string;
  user_id: string;
  count: number;
  created_at: string;
}

interface ActivityItem {
  id: string;
  label: string;
  title: string;
  support: string;
  created_at: string;
}

export function GroupDetailScreen({ route, navigation }: any) {
  const groupId = route?.params?.groupId;
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [testimonies, setTestimonies] = useState<TestimonyRow[]>([]);
  const [loadingTestimonies, setLoadingTestimonies] = useState(false);
  const [members, setMembers] = useState<GroupMemberRow[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [groupMissions, setGroupMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [contributions, setContributions] = useState<ContributionRow[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const [showTestimonyForm, setShowTestimonyForm] = useState(false);
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyBody, setTestimonyBody] = useState('');
  const [testimonyRequestId, setTestimonyRequestId] = useState<string | null>(null);
  const [savingTestimony, setSavingTestimony] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [savingRequest, setSavingRequest] = useState(false);

  const loadGroup = useCallback(async () => {
    if (groupId) {
      const { data } = await supabase
        .from('prayer_groups')
        .select('id,name,description,type,visibility,join_mode,owner_id,created_at')
        .eq('id', groupId)
        .single();
      setGroup(data ?? null);
    } else {
      const { data } = await supabase
        .from('prayer_groups')
        .select('id,name,description,type,visibility,join_mode,owner_id,created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      setGroup(data?.[0] ?? null);
    }
    setLoading(false);
  }, [groupId]);

  const loadMembers = useCallback(async () => {
    if (!groupId) return;
    setLoadingMembers(true);
    const { data } = await supabase
      .from('group_members')
      .select('user_id,role')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    setMembers((data ?? []) as GroupMemberRow[]);
    setLoadingMembers(false);
  }, [groupId]);

  const loadRequests = useCallback(async () => {
    if (!groupId) return;
    setLoadingRequests(true);
    const { data } = await supabase
      .from('prayer_requests')
      .select('id,title,body,user_id,group_id,is_answered,visibility,created_at')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(20);
    setRequests((data ?? []) as PrayerRequest[]);
    setLoadingRequests(false);
  }, [groupId]);

  const loadMissions = useCallback(async () => {
    if (!groupId) return;
    setLoadingMissions(true);
    const { data } = await supabase
      .from('missions')
      .select('id,title,intention,prayer_type,target_count,current_count,goal_unit,deadline_at,group_id,creator_id,created_at')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(10);
    setGroupMissions((data ?? []) as Mission[]);
    setLoadingMissions(false);
  }, [groupId]);

  const loadActivity = useCallback(async () => {
    if (!groupId) return;
    setLoadingActivity(true);

    const { data: missionsData } = await supabase
      .from('missions')
      .select('id,title')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(20);

    const missionIds = (missionsData ?? []).map((m) => m.id);
    const missionTitleById = new Map((missionsData ?? []).map((m) => [m.id, m.title]));

    const { data } = missionIds.length > 0
      ? await supabase
          .from('mission_contributions')
          .select('id,mission_id,user_id,count,created_at')
          .in('mission_id', missionIds)
          .order('created_at', { ascending: false })
          .limit(20)
      : { data: [] };

    setContributions((data ?? []) as ContributionRow[]);
    setLoadingActivity(false);
  }, [groupId]);

  const loadTestimonies = useCallback(async () => {
    if (!groupId) return;
    setLoadingTestimonies(true);

    const { data: memberUserIds } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId);

    const userIds = memberUserIds?.map((m) => m.user_id) ?? [];
    const requestIds = requests.map((r) => r.id);

    const { data: linkedTestimonies } = requestIds.length > 0
      ? await supabase
          .from('testimonies')
          .select('id,title,body,prayer_request_id,user_id,created_at')
          .in('prayer_request_id', requestIds)
          .order('created_at', { ascending: false })
          .limit(20)
      : { data: [] };

    const { data: memberTestimonies } = userIds.length > 0
      ? await supabase
          .from('testimonies')
          .select('id,title,body,prayer_request_id,user_id,created_at')
          .in('user_id', userIds)
          .order('created_at', { ascending: false })
          .limit(20)
      : { data: [] };

    const seen = new Set<string>();
    const allTestimonies: TestimonyRow[] = [];
    for (const t of [...(linkedTestimonies ?? []), ...(memberTestimonies ?? [])]) {
      if (!seen.has(t.id)) {
        seen.add(t.id);
        allTestimonies.push(t);
      }
    }

    setTestimonies(allTestimonies.slice(0, 20));
    setLoadingTestimonies(false);
  }, [groupId, requests]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  useEffect(() => {
    if (!groupId) return;
    loadMembers();
    loadRequests();
    loadMissions();
    loadActivity();
  }, [groupId, loadMembers, loadRequests, loadMissions, loadActivity]);

  useEffect(() => {
    if (groupId) {
      loadTestimonies();
    }
  }, [groupId, loadTestimonies]);

  const handleCreateRequest = async () => {
    if (!requestTitle.trim() || !requestBody.trim()) {
      Alert.alert('Missing details', 'Please enter a title and prayer request.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
      return;
    }

    setSavingRequest(true);

    try {
      const { error } = await supabase.from('prayer_requests').insert({
        title: requestTitle,
        body: requestBody,
        user_id: user.id,
        group_id: groupId,
        visibility: 'group',
      });

      if (error) throw error;

      setRequestTitle('');
      setRequestBody('');
      setShowRequestForm(false);
      await loadRequests();
    } catch (error: any) {
      Alert.alert('Create failed', error.message ?? 'Something went wrong');
    } finally {
      setSavingRequest(false);
    }
  };

  const handleCreateTestimony = async () => {
    if (!testimonyTitle.trim() || !testimonyBody.trim()) {
      Alert.alert('Missing details', 'Please enter a title and your testimony.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
      return;
    }

    setSavingTestimony(true);

    try {
      const { error } = await supabase.from('testimonies').insert({
        title: testimonyTitle,
        body: testimonyBody,
        user_id: user.id,
        prayer_request_id: testimonyRequestId,
      });

      if (error) throw error;

      setTestimonyTitle('');
      setTestimonyBody('');
      setTestimonyRequestId(null);
      setShowTestimonyForm(false);
      await loadTestimonies();
    } catch (error: any) {
      Alert.alert('Create failed', error.message ?? 'Something went wrong');
    } finally {
      setSavingTestimony(false);
    }
  };

  const memberCount = members.length;
  const ownerPresent = useMemo(() => members.some((member) => member.role === 'owner'), [members]);
  const openRequestsCount = requests.filter((req) => !req.is_answered).length;

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const missionTitleById = new Map(groupMissions.map((mission) => [mission.id, mission.title]));

    const contributionItems = contributions.map((item) => ({
      id: `contribution-${item.id}`,
      label: 'Prayer logged',
      title: `${item.count} prayer${item.count === 1 ? '' : 's'} contributed`,
      support: missionTitleById.get(item.mission_id) || 'Contribution to a group prayer goal',
      created_at: item.created_at,
    }));

    const requestItems = requests.map((item) => ({
      id: `request-${item.id}`,
      label: item.is_answered ? 'Answered request' : 'Prayer request',
      title: item.title,
      support: item.body,
      created_at: item.created_at,
    }));

    return [...contributionItems, ...requestItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [contributions, groupMissions, requests]);

  return (
    <ScreenShell
      title={group?.name || 'Group Detail'}
      subtitle={group ? 'This group is your prayer home: members, goals, requests, and shared momentum.' : 'Prayer requests, testimonies, and shared prayer from this group.'}
    >
      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {group ? (
        <>
          <SectionCard
            label={`${group.type} · ${group.visibility === 'private' ? 'Private' : 'Public'}`}
            title={group.name}
            support={group.description || 'No description yet.'}
          />

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{memberCount}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{groupMissions.length}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{openRequestsCount}</Text>
              <Text style={styles.statLabel}>Open Requests</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Members</Text>
            <Text style={styles.sectionMeta}>{ownerPresent ? 'Owner present' : 'Owner not visible'}</Text>
          </View>

          {loadingMembers ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingMembers && members.length === 0 ? (
            <SectionCard
              label="No members visible"
              title="This group has no visible members yet"
              support="Membership data will appear here when group members are available."
            />
          ) : null}

          {members.slice(0, 6).map((member, index) => (
            <SectionCard
              key={`${member.user_id}-${index}`}
              label={member.role === 'owner' ? 'Owner' : 'Member'}
              title={`Member ${index + 1}`}
              support={member.user_id}
            />
          ))}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Group Prayer Goals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateMission', { groupId: group.id })}>
              <Text style={styles.sectionAction}>+ Goal</Text>
            </TouchableOpacity>
          </View>

          {loadingMissions ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingMissions && groupMissions.length === 0 ? (
            <SectionCard
              label="No goals yet"
              title="Create this group's first prayer goal"
              support="Attach a rosary, decade, or Hail Mary goal to this group so members can pray toward something together."
            />
          ) : null}

          {groupMissions.map((mission) => {
            const pct = Math.min(100, Math.round((mission.current_count / Math.max(mission.target_count, 1)) * 100));
            return (
              <TouchableOpacity
                key={mission.id}
                onPress={() => navigation.navigate('MissionDetail', { missionId: mission.id })}
              >
                <SectionCard
                  label={`${mission.goal_unit} · ${pct}% complete`}
                  title={mission.title}
                  support={`${mission.current_count} / ${mission.target_count}${mission.intention ? ` · ${mission.intention}` : ''}`}
                />
              </TouchableOpacity>
            );
          })}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.sectionMeta}>Latest movement in this group</Text>
          </View>

          {loadingActivity ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingActivity && recentActivity.length === 0 ? (
            <SectionCard
              label="No activity yet"
              title="This group has not moved yet"
              support="As members contribute prayers and post requests, the latest activity will appear here."
            />
          ) : null}

          {recentActivity.map((item) => (
            <SectionCard
              key={item.id}
              label={item.label}
              title={item.title}
              support={item.support}
            />
          ))}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Prayer Requests</Text>
            <TouchableOpacity onPress={() => setShowRequestForm(!showRequestForm)}>
              <Text style={styles.sectionAction}>{showRequestForm ? 'Cancel' : '+ New'}</Text>
            </TouchableOpacity>
          </View>

          {showRequestForm ? (
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Request title"
                placeholderTextColor="#94A39A"
                value={requestTitle}
                onChangeText={setRequestTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What should we pray for?"
                placeholderTextColor="#94A39A"
                value={requestBody}
                onChangeText={setRequestBody}
                multiline
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateRequest} disabled={savingRequest}>
                <Text style={styles.primaryButtonText}>{savingRequest ? 'Posting...' : 'Post prayer request'}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {loadingRequests ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingRequests && requests.length === 0 ? (
            <SectionCard
              label="No requests yet"
              title="Be the first to ask for prayer"
              support="Post a prayer request and invite this group to pray with you."
            />
          ) : null}

          {requests.map((req) => (
            <SectionCard
              key={req.id}
              label={req.is_answered ? 'Answered' : 'Requesting prayer'}
              title={req.title}
              support={req.body}
            />
          ))}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Testimonies</Text>
            <TouchableOpacity onPress={() => setShowTestimonyForm(!showTestimonyForm)}>
              <Text style={styles.sectionAction}>{showTestimonyForm ? 'Cancel' : '+ Share'}</Text>
            </TouchableOpacity>
          </View>

          {showTestimonyForm ? (
            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#94A39A"
                value={testimonyTitle}
                onChangeText={setTestimonyTitle}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your testimony"
                placeholderTextColor="#94A39A"
                value={testimonyBody}
                onChangeText={setTestimonyBody}
                multiline
              />
              {requests.length > 0 ? (
                <View style={styles.chipRow}>
                  <TouchableOpacity
                    style={[styles.chip, !testimonyRequestId && styles.chipActive]}
                    onPress={() => setTestimonyRequestId(null)}
                  >
                    <Text style={[styles.chipText, !testimonyRequestId && styles.chipTextActive]}>General</Text>
                  </TouchableOpacity>
                  {requests.map((req) => (
                    <TouchableOpacity
                      key={req.id}
                      style={[styles.chip, testimonyRequestId === req.id && styles.chipActive]}
                      onPress={() => setTestimonyRequestId(req.id)}
                    >
                      <Text style={[styles.chipText, testimonyRequestId === req.id && styles.chipTextActive]} numberOfLines={1}>
                        {req.title.slice(0, 18)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateTestimony} disabled={savingTestimony}>
                <Text style={styles.primaryButtonText}>{savingTestimony ? 'Sharing...' : 'Share testimony'}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {loadingTestimonies ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingTestimonies && testimonies.length === 0 ? (
            <SectionCard
              label="No testimonies yet"
              title="Share what God has done"
              support="When a prayer is answered, share your testimony to encourage this group."
            />
          ) : null}

          {testimonies.map((t) => (
            <SectionCard
              key={t.id}
              label="Testimony"
              title={t.title}
              support={t.body}
            />
          ))}

          <SectionCard
            label="Share this group"
            title={group.id}
            support="Share this ID with others so they can join using the Join Group screen."
          />
        </>
      ) : !loading ? (
        <SectionCard
          label="No group selected"
          title="Open a group from the Groups tab"
          support="Once you create or join a group, its details will appear here."
        />
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#6E7A70',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionAction: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 14,
  },
  input: {
    backgroundColor: '#F5F8F4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F8F4',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
