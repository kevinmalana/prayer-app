import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';

export function ProfileHubScreen() {
  return (
    <ScreenShell
      title="Profile"
      subtitle="Your prayer rhythm, contribution history, reminders, and future milestones will live here."
    >
      <SectionCard
        label="Current streak"
        title="6 days"
        support="A simple measure of consistency without turning prayer into a gamified mess."
      />
      <SectionCard
        label="Your impact"
        title="125 prayers contributed"
        support="Show completed Hail Marys, joined prayer goals, and answered-prayer participation."
      />
      <SectionCard
        label="Reminders"
        title="Evening rosary · 8:30 PM"
        support="Future settings area for reminders, quiet hours, and Catholic calendar notifications."
      />
    </ScreenShell>
  );
}
