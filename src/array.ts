type EachFn = <T>(el: T, index: number) => Undefined<boolean>;
type StopFn = <T>(el: T, index: number) => void;

class ForEachBreakException<T> extends Error {
  constructor(public readonly element: T, public readonly index: number) {
    super('');
  }
}

export function inArray<T>(array: T[], element: T): boolean {
  return array.indexOf(element) !== -1;
}

export function firstElement<T>(array: T[]): T | null {
  return array.length === 0 ? null : array[0];
}

export function lastElement<T>(array: T[]): T | null {
  return array.length === 0 ? null : array[array.length - 1];
}

export function pushElement<T>(array: T[], element: T): T[] {
  return [...array, element];
}

export function changeElement<T>(array: T[], old: T, element: T): T[] {
  return array.map((value) => (value === old ? element : value));
}

export function removeElement<T>(array: T[], value: number | T): T[] {
  return array.filter((element, index) =>
    typeof value === 'number' ? value !== index : element !== value
  );
}

export function eachArray<T>(array: T[], each: EachFn, stop?: StopFn): boolean {
  try {
    array.forEach((element, index) => {
      const stop = each(element, index);

      if (stop) {
        throw new ForEachBreakException(element, index);
      }
    });

    return true;
  } catch (error) {
    if (stop && error instanceof ForEachBreakException<T>) {
      stop(error.element, error.index);
    }

    return false;
  }
}
