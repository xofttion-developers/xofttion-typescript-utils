export enum MILLISECONDS {
  YEAR = 31536000000,
  MONTH = 2592000000,
  WEEK = 604800000,
  DAY = 86400000,
  HOUR = 3600000,
  MINUTE = 60000,
  SECOND = 1000
}

interface ElapsedTime {
  value: number;
  label: string;
  single: string;
  plural: string;
}

interface PendingTime {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function createElapsedTime(
  value: MILLISECONDS,
  single: string,
  charPlural = 's',
  plural?: string
): ElapsedTime {
  plural = plural || `${single}${charPlural}`;

  const label = `${single}(${charPlural})`;

  return {
    value,
    label,
    single,
    plural
  };
}

const ELAPSED_TIMES: ElapsedTime[] = [
  createElapsedTime(MILLISECONDS.YEAR, 'año'),
  createElapsedTime(MILLISECONDS.MONTH, 'mes', 'es'),
  createElapsedTime(MILLISECONDS.WEEK, 'semana'),
  createElapsedTime(MILLISECONDS.DAY, 'día', 's', 'dias'),
  createElapsedTime(MILLISECONDS.HOUR, 'hora'),
  createElapsedTime(MILLISECONDS.MINUTE, 'minuto'),
  createElapsedTime(MILLISECONDS.SECOND, 'segundo')
];

export function getFormatForHumans(milliseconds: number): string {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < ELAPSED_TIMES.length) {
    const elapsed = ELAPSED_TIMES[index];
    const result = Math.floor(value / elapsed.value);

    if (result >= 1) {
      const label = result === 1 ? elapsed.single : elapsed.plural;

      description = `${prefix} ${result} ${label}`;
    }

    index++;
  }

  return description;
}

export function getPendingTime(initial: Date, future = new Date()): PendingTime {
  const difference = future.getTime() - initial.getTime();

  return {
    years: Math.floor(difference / MILLISECONDS.YEAR),
    months: Math.floor(difference / MILLISECONDS.MONTH),
    weeks: Math.floor(difference / MILLISECONDS.WEEK),
    days: Math.floor(difference / MILLISECONDS.DAY),
    hours: Math.floor(difference / MILLISECONDS.HOUR),
    minutes: Math.floor(difference / MILLISECONDS.MINUTE),
    seconds: Math.floor(difference / MILLISECONDS.SECOND)
  };
}

export function updateDateWithDays(date: Date, days = 1): Date {
  return updateDateWithTimestamp(date, days * MILLISECONDS.DAY);
}

export function updateDateWithMonths(date: Date, months = 1): Date {
  return updateDateWithTimestamp(date, months * MILLISECONDS.MONTH);
}

export function updateDateWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}
