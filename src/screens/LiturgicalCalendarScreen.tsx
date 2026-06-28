import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { SectionCard } from '../components/SectionCard';
import { colors } from '../theme/colors';
import { fetchLiturgicalDay, getFallbackLiturgicalDay, LiturgicalDay } from '../lib/liturgical';

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
}

export function LiturgicalCalendarScreen() {
  const [items, setItems] = useState<LiturgicalDay[]>([]);
  const [loading, setLoading] = useState(true);

  const dates = useMemo(() => Array.from({ length: 30 }, (_, i) => addDays(new Date(), i)), []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const results = await Promise.all(dates.map((date) => fetchLiturgicalDay(date)));
      if (active) {
        setItems(results);
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [dates]);

  return (
    <ScreenShell
      title="Liturgical Calendar"
      subtitle="Upcoming Catholic daily information for the next month."
    >
      {loading ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}

      {!loading && items.length === 0 ? (
        <SectionCard
          label="No calendar data"
          title="Could not load the liturgical calendar"
          support="Try again later."
        />
      ) : null}

      {items.map((item, index) => (
        <SectionCard
          key={`${item.date}-${index}`}
          label={formatDateLabel(dates[index])}
          title={item.celebrationName}
          support={`${item.season} · ${item.rosaryMystery}${item.description ? ` · ${item.description}` : ''}`}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 8,
  },
});
