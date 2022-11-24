import { getDateFormat, getDateWeight, isLeapYear } from '../date';
import { getFormatForHumans } from '../date-elapsed';

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

export {};
