import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { supabase } from '../lib/supabase';
import type { GroupMessage, Mission, PrayerRequest } from '../types/domain';

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
  current_intention: string | null;
  intention_updated_at: string | null;
  created_at: string;
}

interface GroupMemberRow {
  user_id: string;
  role: string;
  last_active_at?: string | null;
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
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [showTestimonyForm, setShowTestimonyForm] = useState(false);
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyBody, setTestimonyBody] = useState('');
  const [testimonyRequestId, setTestimonyRequestId] = useState<string | null>(null);
  const [savingTestimony, setSavingTestimony] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [savingRequest, setSavingRequest] = useState(false);

  const [editingIntention, setEditingIntention] = useState(false);
  const [intentionDraft, setIntentionDraft] = useState('');
  const [savingIntention, setSavingIntention] = useState(false);
  const [sharingGroup, setSharingGroup] = useState(false);

  const [messageDraft, setMessageDraft] = useState('');
  const [savingMessage, setSavingMessage] = useState(false);

  const loadGroup = useCallback(async () => {
    if (groupId) {
      const { data } = await supabase
        .from('prayer_groups')
        .select('id,name,description,type,visibility,join_mode,owner_id,current_intention,intention_updated_at,created_at')
        .eq('id', groupId)
        .single();
      setGroup(data ?? null);
      setIntentionDraft(data?.current_intention ?? '');
    } else {
      const { data } = await supabase
        .from('prayer_groups')
        .select('id,name,description,type,visibility,join_mode,owner_id,current_intention,intention_updated_at,created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      setGroup(data?.[0] ?? null);
      setIntentionDraft(data?.[0]?.current_intention ?? '');
    }
    setLoading(false);
  }, [groupId]);

  const loadMembers = useCallback(async () => {
    if (!groupId) return;
    setLoadingMembers(true);
    const { data } = await supabase
      .from('group_members')
      .select('user_id,role,last_active_at')
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

  const loadMessages = useCallback(async () => {
    if (!groupId) return;
    setLoadingMessages(true);
    const { data } = await supabase
      .from('group_messages')
      .select('id,group_id,user_id,body,created_at')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(25);
    setMessages((data ?? []) as GroupMessage[]);
    setLoadingMessages(false);
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
    loadMessages();
  }, [groupId, loadMembers, loadRequests, loadMissions, loadActivity, loadMessages]);

  useEffect(() => {
    if (groupId) {
      loadTestimonies();
    }
  }, [groupId, loadTestimonies]);

  const handleShareGroup = async () => {
    if (!group) return;

    setSharingGroup(true);
    try {
      const message = `Join my prayer group on One in Prayer. Group: ${group.name}. Group ID: ${group.id}`;
      await Share.share({
        message,
        title: `Invite to ${group.name}`,
      });
    } catch (error: any) {
      Alert.alert('Share failed', error?.message ?? 'Could not open sharing.');
    } finally {
      setSharingGroup(false);
    }
  };

  const handleSaveIntention = async () => {
    if (!group) return;
    setSavingIntention(true);
    try {
      const { error } = await supabase
        .from('prayer_groups')
        .update({ current_intention: intentionDraft.trim() || null, intention_updated_at: new Date().toISOString() })
        .eq('id', group.id);

      if (error) throw error;
      setEditingIntention(false);
      await loadGroup();
    } catch (error: any) {
      Alert.alert('Save failed', error.message ?? 'Could not save group intention.');
    } finally {
      setSavingIntention(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageDraft.trim()) {
      Alert.alert('Missing message', 'Write a short message first.');
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in first.');
      return;
    }

    setSavingMessage(true);
    try {
      const { error: insertError } = await supabase.from('group_messages').insert({
        group_id: groupId,
        user_id: user.id,
        body: messageDraft.trim(),
      });

      if (insertError) throw insertError;

      await supabase
        .from('group_members')
        .update({ last_active_at: new Date().toISOString() })
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      setMessageDraft('');
      await loadMessages();
      await loadMembers();
    } catch (error: any) {
      Alert.alert('Message failed', error.message ?? 'Could not send message.');
    } finally {
      setSavingMessage(false);
    }
  };

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
  const openRequestsCount = requests.filter((req) => !req.is_answered).length;
  const totalGoalProgress = groupMissions.reduce((sum, mission) => sum + mission.current_count, 0);
  const totalGoalTarget = groupMissions.reduce((sum, mission) => sum + mission.target_count, 0);
  const groupProgressPct = totalGoalTarget > 0 ? Math.min(100, Math.round((totalGoalProgress / totalGoalTarget) * 100)) : 0;
  const weeklyMomentum = contributions.filter((item) => Date.now() - new Date(item.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000).length;
  const groupStreak = Math.min(weeklyMomentum, 7);

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

    const messageItems = messages.map((item) => ({
      id: `message-${item.id}`,
      label: 'Group chat',
      title: item.body.length > 40 ? `${item.body.slice(0, 40)}…` : item.body,
      support: 'Message posted in this group',
      created_at: item.created_at,
    }));

    return [...contributionItems, ...requestItems, ...messageItems]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);
  }, [contributions, groupMissions, requests, messages]);

  return (
    <ScreenShell
      title={group?.name || 'Group Detail'}
      subtitle={group ? 'Group intention, chat, prayer goals, and momentum all in one place.' : 'Prayer requests, testimonies, and shared prayer from this group.'}
    >
      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      {group ? (
        <>
          <SectionCard
            label={`${group.type} · ${group.visibility === 'private' ? 'Private' : 'Public'}`}
            title={group.name}
            support={group.description || 'No description yet.'}
          >
            <View style={styles.inlineRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleShareGroup} disabled={sharingGroup}>
                <Text style={styles.secondaryButtonText}>{sharingGroup ? 'Opening…' : 'Share group'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('JoinGroup')}>
                <Text style={styles.primaryButtonText}>Invite flow</Text>
              </TouchableOpacity>
            </View>
          </SectionCard>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{memberCount}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{groupProgressPct}%</Text>
              <Text style={styles.statLabel}>Momentum</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{groupStreak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>

          <SectionCard
            label="Group intention"
            title={group.current_intention || 'No active group intention'}
            support={group.intention_updated_at ? `Updated ${new Date(group.intention_updated_at).toLocaleDateString('en-US')}` : 'Set one shared intention so the group is praying toward the same heart.'}
          >
            {editingIntention ? (
              <View style={styles.innerForm}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter the group's active intention"
                  placeholderTextColor="#94A39A"
                  value={intentionDraft}
                  onChangeText={setIntentionDraft}
                  multiline
                />
                <View style={styles.inlineRow}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => setEditingIntention(false)}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryButton} onPress={handleSaveIntention} disabled={savingIntention}>
                    <Text style={styles.primaryButtonText}>{savingIntention ? 'Saving...' : 'Save intention'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setEditingIntention(true)}>
                <Text style={styles.secondaryButtonText}>{group.current_intention ? 'Edit intention' : 'Set intention'}</Text>
              </TouchableOpacity>
            )}
          </SectionCard>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Group Chat</Text>
            <Text style={styles.sectionMeta}>{messages.length} messages</Text>
          </View>

          <View style={styles.formCard}>
            <TextInput
              style={[styles.input, styles.chatInput]}
              placeholder="Write a short message to the group"
              placeholderTextColor="#94A39A"
              value={messageDraft}
              onChangeText={setMessageDraft}
              multiline
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleSendMessage} disabled={savingMessage}>
              <Text style={styles.primaryButtonText}>{savingMessage ? 'Sending...' : 'Send message'}</Text>
            </TouchableOpacity>
          </View>

          {loadingMessages ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingMessages && messages.length === 0 ? (
            <SectionCard
              label="No messages yet"
              title="Start the group conversation"
              support="Use chat for quick encouragement, updates, and prayer coordination."
            />
          ) : null}

          {messages.map((message, index) => (
            <SectionCard
              key={message.id}
              label={`Message ${messages.length - index}`}
              title={message.body}
              support={`Member · ${new Date(message.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
            />
          ))}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Members</Text>
            <Text style={styles.sectionMeta}>{memberCount} total</Text>
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
              support={member.last_active_at ? `Active ${new Date(member.last_active_at).toLocaleDateString('en-US')}` : member.user_id}
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

          <SectionCard
            label="Group gamification"
            title={groupProgressPct >= 100 ? 'Goal momentum complete' : `${groupProgressPct}% of all group goals completed`}
            support={`Weekly momentum: ${weeklyMomentum} activity item${weeklyMomentum === 1 ? '' : 's'} · Current streak: ${groupStreak} day${groupStreak === 1 ? '' : 's'}`}
          />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Text style={styles.sectionMeta}>Latest movement in this group</Text>
          </View>

          {loadingActivity ? <ActivityIndicator color={colors.primary} /> : null}

          {!loadingActivity && recentActivity.length === 0 ? (
            <SectionCard
              label="No activity yet"
              title="This group has not moved yet"
              support="As members contribute prayers, message, and post requests, the latest activity will appear here."
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
          >
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShareGroup} disabled={sharingGroup}>
              <Text style={styles.secondaryButtonText}>{sharingGroup ? 'Opening…' : 'Share to WhatsApp or another app'}</Text>
            </TouchableOpacity>
          </SectionCard>
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
  innerForm: {
    gap: 12,
    marginTop: 12,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 10,
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
  chatInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
    fontSize: 15,
    fontWeight: '800',
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
