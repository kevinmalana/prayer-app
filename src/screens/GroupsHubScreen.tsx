import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';

export function GroupsHubScreen() {
  return (
    <ScreenShell
      title="Groups"
      subtitle="Family, parish, youth, and ministry spaces where prayer becomes shared and consistent."
    >
      <SectionCard
        label="Family Prayer Circle"
        title="12 members · 3 active missions"
        support="Private space for daily rosary, prayer requests, and answered prayers."
      />
      <SectionCard
        label="St Mary Parish"
        title="240 members · Rosary this week"
        support="Large-group prayer campaigns, feast-day missions, and parish-wide reminders."
      />
      <SectionCard
        label="Youth Rosary"
        title="36 members · Friday night prayer"
        support="Smaller circles with lighter tone, faster invites, and repeat weekly missions."
      />
    </ScreenShell>
  );
}
