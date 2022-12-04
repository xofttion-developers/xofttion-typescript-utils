import { getDateFormat, getDateWeight, isLeapYear } from './date';
import { getFormatForHumans } from './date-elapsed';

export function enabledPrimiviteExtensions(): void {
  Object.defineProperty(Array.prototype, 'empty', {
    get: function () {
      return this.length === 0;
    },
    enumerable: false,
    configurable: true
  });

  Array.prototype.exists = function <T>(element: T): boolean {
    return this.indexOf(element) !== -1;
  };

  Array.prototype.firstElement = function <T>(): T | null {
    return this.empty ? null : this[0];
  };

  Array.prototype.lastElement = function <T>(): T | null {
    return this.empty ? null : this[this.length - 1];
  };

  Array.prototype.remove = function <T>(value: number | T): T[] {
    const index = typeof value === 'number' ? value : this.indexOf(value);

    return this.splice(index, 1);
  };

  Date.prototype.isEquals = function (date = new Date()): boolean {
    return this.getTime() === date.getTime();
  };

  Date.prototype.isEqualsWeight = function (date = new Date()): boolean {
    return this.getWeight() === date.getWeight();
  };

  Date.prototype.isBefore = function (date = new Date()): boolean {
    return this.getTime() > date.getTime();
  };

  Date.prototype.isBeforeOrEquals = function (date = new Date()): boolean {
    return this.getTime() >= date.getTime();
  };

  Date.prototype.isAfter = function (date = new Date()): boolean {
    return this.getTime() < date.getTime();
  };

  Date.prototype.isAfterOrEquals = function (date = new Date()): boolean {
    return this.getTime() <= date.getTime();
  };

  Date.prototype.isLeapYear = function (): boolean {
    return isLeapYear(this.getFullYear());
  };

  Date.prototype.getFormat = function (pattern = 'aa-mm-dd'): string {
    return getDateFormat(this, pattern);
  };

  Date.prototype.getWeight = function (): number {
    return getDateWeight(this);
  };

  Date.prototype.merge = function (date = new Date()): Date {
    this.setFullYear(date.getFullYear());
    this.setMonth(date.getMonth());
    this.setDate(date.getDate());
    this.setHours(date.getHours());
    this.setMinutes(date.getMinutes());
    this.setSeconds(date.getSeconds());

    return this;
  };

  Date.prototype.getDifference = function (date = new Date()): number {
    return this.getTime() - date.getTime();
  };

  Date.prototype.getDifferenceForHumans = function (date = new Date()): string {
    return getFormatForHumans(this.getDifference(date));
  };

  Date.prototype.normalizeTimeMin = function (): Date {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);

    return this;
  };

  Date.prototype.normalizeTimeMax = function (): Date {
    this.setHours(23);
    this.setMinutes(59);
    this.setSeconds(59);
    this.setMilliseconds(0);

    return this;
  };

  Object.defineProperty(String.prototype, 'empty', {
    get: function () {
      return this.length === 0;
    },
    enumerable: false,
    configurable: true
  });

  String.prototype.firstChar = function (): string {
    return this.empty ? '' : this.charAt(0);
  };

  String.prototype.lastChar = function (): string {
    return this.empty ? '' : this.charAt(this.length - 1);
  };
}
