import { getFormatForHumans } from './date-elapsed';

export const MONTHS_NAME = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

export const MONTHS_NAME_MIN = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic'
];

export const MONTHS_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const DAYS_NAME = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const DAYS_NAME_MIN = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

type FnFormatDate = (date: Date) => string;

interface DateFormat {
  [key: string]: FnFormatDate;
}

const DATE_FORMATTERS: DateFormat = {
  dd: (date: Date): string => {
    return completFormat(date.getDate(), 2);
  },
  dw: (date: Date): string => {
    return DAYS_NAME[date.getDay()];
  },
  dx: (date: Date): string => {
    return DAYS_NAME_MIN[date.getDay()];
  },
  mm: (date: Date): string => {
    return completFormat(date.getMonth() + 1, 2);
  },
  mn: (date: Date): string => {
    return MONTHS_NAME[date.getDay()];
  },
  mx: (date: Date): string => {
    return MONTHS_NAME_MIN[date.getMonth()];
  },
  aa: (date: Date): string => {
    return completFormat(date.getFullYear(), 4);
  },
  hh: (date: Date): string => {
    return completFormat(date.getHours(), 2);
  },
  ii: (date: Date): string => {
    return completFormat(date.getMinutes(), 2);
  },
  ss: (date: Date): string => {
    return completFormat(date.getSeconds(), 2);
  },
  hz: (date: Date): string => {
    return completFormat(getHourFormat(date), 2);
  },
  zz: (date: Date): string => {
    return date.getHours() > 11 ? 'PM' : 'AM';
  }
};

export function equalsDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() === compareDate.getTime();
}

export function equalsDateWeight(date: Date, compareDate = new Date()): boolean {
  return getDateWeight(date) === getDateWeight(compareDate);
}

export function isBeforeDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() > compareDate.getTime();
}

export function isBeforeOrEqualsDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() >= compareDate.getTime();
}

export function isAfterDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() < compareDate.getTime();
}

export function isAfterOrEqualsDate(date: Date, compareDate = new Date()): boolean {
  return date.getTime() <= compareDate.getTime();
}

export function getDifference(date: Date, compareDate = new Date()): number {
  return date.getTime() - compareDate.getTime();
}

export function getDifferenceForHumans(
  date: Date,
  compareDate = new Date()
): string {
  return getFormatForHumans(getDifference(date, compareDate));
}

export function normalizeMinTime(date: Date): void {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
}

export function normalizeTimeMax(date: Date): void {
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(0);
}

export function getDateWeight(date: Date): number {
  return date.getFullYear() * 365 + (date.getMonth() + 1) * 30 + date.getDate();
}

export function getDaysMonth(year: number, month: number): number {
  return month === 1 && isLeapYear(year) ? 29 : MONTHS_DAYS[month];
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function getDateFormat(date: Date, pattern: string): string {
  let format = pattern;

  Object.keys(DATE_FORMATTERS).forEach((key) => {
    if (format.includes(key)) {
      format = format.replace(key, DATE_FORMATTERS[key](date));
    }
  });

  return format;
}

export function createDate(year?: number, month?: number, day?: number): Date {
  const date = new Date();

  if (year) {
    verifyDayYear(date, year);
  }

  if (month) {
    verifyDayMonth(date, month);
  }

  if (day) {
    date.setDate(day);
  }

  return date;
}

export function changeYear(date: Date, year: number): Date {
  const newDate = new Date(date.getTime());

  verifyDayYear(newDate, year);

  newDate.setFullYear(year);

  return newDate;
}

export function changeMonth(date: Date, month: number): Date {
  const newDate = new Date(date.getTime());

  verifyDayMonth(newDate, month);

  newDate.setMonth(month);

  return newDate;
}

export function changeDay(date: Date, day: number): Date {
  const newDate = new Date(date.getTime());

  newDate.setDate(day);

  return newDate;
}

function completFormat(value: number, size: number): string {
  return value.toString().padStart(size, '0');
}

function getHourFormat(date: Date): number {
  const hour = date.getHours();

  return hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
}

function verifyDayYear(date: Date, year: number): void {
  const days = getDaysMonth(year, date.getMonth());

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setFullYear(year); // Establecer el año
}

function verifyDayMonth(date: Date, month: number): void {
  const days = getDaysMonth(date.getFullYear(), month);

  if (days < date.getDate()) {
    date.setDate(days);
  }

  date.setMonth(month); // Establecer el mes
}
