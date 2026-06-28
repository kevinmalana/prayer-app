const CALENDAR_BASE_URL = 'https://cpbjr.github.io/catholic-readings-api/liturgical-calendar';

export interface LiturgicalDay {
  date: string;
  season: string;
  celebrationName: string;
  celebrationType: string;
  quote: string;
  description: string;
  rosaryMystery: string;
  source: 'live' | 'fallback';
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getWeekdayName(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getRosaryMystery(date: Date) {
  const weekday = date.getDay();
  switch (weekday) {
    case 1:
    case 6:
      return 'Joyful Mysteries';
    case 2:
    case 5:
      return 'Sorrowful Mysteries';
    case 3:
    case 0:
      return 'Glorious Mysteries';
    case 4:
      return 'Luminous Mysteries';
    default:
      return 'Rosary of the Day';
  }
}

export function getFallbackLiturgicalDay(date = new Date()): LiturgicalDay {
  return {
    date: toDateKey(date),
    season: 'Ordinary Time',
    celebrationName: getWeekdayName(date),
    celebrationType: 'DAY',
    quote: '',
    description: 'Catholic daily liturgical information for today.',
    rosaryMystery: getRosaryMystery(date),
    source: 'fallback',
  };
}

export async function fetchLiturgicalDay(date = new Date()): Promise<LiturgicalDay> {
  const dateKey = toDateKey(date);
  const fallback = getFallbackLiturgicalDay(date);

  try {
    const response = await fetch(`${CALENDAR_BASE_URL}/${dateKey.slice(0, 4)}/${dateKey.slice(5)}.json`);
    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as {
      date?: string;
      season?: string;
      celebration?: {
        name?: string;
        type?: string;
        quote?: string;
        description?: string;
      };
    };

    return {
      date: payload.date ?? fallback.date,
      season: payload.season ?? fallback.season,
      celebrationName: payload.celebration?.name?.trim() || fallback.celebrationName,
      celebrationType: payload.celebration?.type?.trim() || fallback.celebrationType,
      quote: payload.celebration?.quote?.trim() || '',
      description: payload.celebration?.description?.trim() || '',
      rosaryMystery: getRosaryMystery(date),
      source: 'live',
    };
  } catch {
    return fallback;
  }
}
