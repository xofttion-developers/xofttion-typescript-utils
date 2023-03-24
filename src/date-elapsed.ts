export enum Milliseconds {
  Year = 31536000000,
  Month = 2592000000,
  Week = 604800000,
  Day = 86400000,
  Hour = 3600000,
  Minute = 60000,
  Second = 1000
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
  value: Milliseconds,
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

const elapsedTimes: ElapsedTime[] = [
  createElapsedTime(Milliseconds.Year, 'año'),
  createElapsedTime(Milliseconds.Month, 'mes', 'es'),
  createElapsedTime(Milliseconds.Week, 'semana'),
  createElapsedTime(Milliseconds.Day, 'día', 's', 'dias'),
  createElapsedTime(Milliseconds.Hour, 'hora'),
  createElapsedTime(Milliseconds.Minute, 'minuto'),
  createElapsedTime(Milliseconds.Second, 'segundo')
];

export function getFormatForHumans(milliseconds: number): string {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < elapsedTimes.length) {
    const elapsed = elapsedTimes[index];
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
    years: Math.floor(difference / Milliseconds.Year),
    months: Math.floor(difference / Milliseconds.Month),
    weeks: Math.floor(difference / Milliseconds.Week),
    days: Math.floor(difference / Milliseconds.Day),
    hours: Math.floor(difference / Milliseconds.Hour),
    minutes: Math.floor(difference / Milliseconds.Minute),
    seconds: Math.floor(difference / Milliseconds.Second)
  };
}

export function updateDateWithDays(date: Date, days = 1): Date {
  return updateDateWithTimestamp(date, days * Milliseconds.Day);
}

export function updateDateWithMonths(date: Date, months = 1): Date {
  return updateDateWithTimestamp(date, months * Milliseconds.Month);
}

export function updateDateWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}
