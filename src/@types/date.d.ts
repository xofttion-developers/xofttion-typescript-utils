declare global {
  interface Date {
    isEquals(date?: Date): boolean;

    isEqualsWeight(date?: Date): boolean;

    isBefore(date?: Date): boolean;

    isBeforeOrEquals(date?: Date): boolean;

    isAfter(date?: Date): boolean;

    isAfterOrEquals(date: Date): boolean;

    isLeapYear(): boolean;

    getFormat(pattern?: string): string;

    getWeight(): number;

    merge(date?: Date): Date;

    getDifference(date?: Date): number;

    getDifferenceForHumans(date?: Date): string;

    normalizeTimeMin(): Date;

    normalizeTimeMax(): Date;
  }
}

export {};
