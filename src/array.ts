type CallEach = <T>(el: T, index: number) => Undefined<boolean>;
type CallStop = <T>(el: T, index: number) => void;

interface EachArray<T> {
  array: T[];
  each: CallEach;
  stop?: CallStop;
}

class ForEachBreakException<T> extends Error {
  constructor(public readonly element: T, public readonly index: number) {
    super('ForEach Exception');
  }
}

export function inArray<T>(array: T[], element: T): boolean {
  return array.indexOf(element) !== -1;
}

export function firstElement<T>(array: T[]): Nulleable<T> {
  return array.length === 0 ? null : array[0];
}

export function lastElement<T>(array: T[]): Nulleable<T> {
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

export function arrayEach<T>(props: EachArray<T>): boolean {
  const { array, each, stop } = props;

  try {
    array.forEach((element, index) => {
      if (each(element, index)) {
        throw new ForEachBreakException(element, index);
      }
    });

    return true;
  } catch (error) {
    if (stop && error instanceof ForEachBreakException) {
      const { element, index } = error;

      stop(element, index);
    }

    return false;
  }
}

export function reduceDistinct<T, V>(array: T[], reducer: (value: T) => V): V[] {
  return array.reduce((result: V[], element) => {
    const value = reducer(element);

    if (!result.includes(value)) {
      result.push(value);
    }

    return result;
  }, []);
}
