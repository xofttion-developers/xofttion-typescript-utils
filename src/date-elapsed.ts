export const MILISECONDS_YEAR = 31536000000;
export const MILISECONDS_MONTH = 2592000000;
export const MILISECONDS_WEEK = 604800000;
export const MILISECONDS_DAY = 86400000;
export const MILISECONDS_HOUR = 3600000;
export const MILISECONDS_MINUTE = 60000;
export const MILISECONDS_SECOND = 1000;

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
  value: number,
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

const elapsedsTime: ElapsedTime[] = [
  createElapsedTime(MILISECONDS_YEAR, 'año'),
  createElapsedTime(MILISECONDS_MONTH, 'mes', 'es'),
  createElapsedTime(MILISECONDS_WEEK, 'semana'),
  createElapsedTime(MILISECONDS_DAY, 'día', 's', 'dias'),
  createElapsedTime(MILISECONDS_HOUR, 'hora'),
  createElapsedTime(MILISECONDS_MINUTE, 'minuto'),
  createElapsedTime(MILISECONDS_SECOND, 'segundo')
];

export function getFormatForHumans(milliseconds: number): string {
  const prefix = milliseconds > 0 ? 'Falta' : 'Hace';
  const value = Math.abs(milliseconds);

  if (value < 1000) {
    return `${prefix} 1 segundo`;
  }

  let description = '';
  let index = 0;

  while (description === '' && index < elapsedsTime.length) {
    const elapsed = elapsedsTime[index];
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
    years: Math.floor(difference / MILISECONDS_YEAR),
    months: Math.floor(difference / MILISECONDS_MONTH),
    weeks: Math.floor(difference / MILISECONDS_WEEK),
    days: Math.floor(difference / MILISECONDS_DAY),
    hours: Math.floor(difference / MILISECONDS_HOUR),
    minutes: Math.floor(difference / MILISECONDS_MINUTE),
    seconds: Math.floor(difference / MILISECONDS_SECOND)
  };
}

export function updateDateWithDays(date: Date, days = 1): Date {
  return updateDateWithTimestamp(date, days * MILISECONDS_DAY);
}

export function updateDateWithMonths(date: Date, months = 1): Date {
  return updateDateWithTimestamp(date, months * MILISECONDS_MONTH);
}

export function updateDateWithTimestamp(date: Date, timestamp: number): Date {
  return new Date(date.getTime() + timestamp);
}
