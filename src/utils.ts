const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];
const prototypeToString = Object.prototype.toString;

const FALSY_VALUES = ['false', 'undefined', '0', 0];

type FnEach = <T>(el: T, index: number) => Undefined<boolean>;
type FnStop = <T>(el: T, index: number) => void;

class ForEachBreakException<T> extends Error {
  constructor(private _element: T, private _index: number) {
    super('');
  }

  public get element(): T {
    return this._element;
  }

  public get index(): number {
    return this._index;
  }
}

export function isDefined(object: any): boolean {
  return typeof object !== 'undefined' && object !== null;
}

export function isUndefined(object: any): boolean {
  return !isDefined(object);
}

export function parseBoolean(value: any): boolean {
  return !(isUndefined(value) || value === false || FALSY_VALUES.includes(value));
}

export function deepClone<A>(object: A): A {
  return clone(object, []);
}

export function pushElement<T>(array: T[], element: T): T[] {
  return [...array, element];
}

export function removeElement<T>(array: T[], element: T): T[] {
  return array.filter((value) => value !== element);
}

export function changeElement<T>(array: T[], old: T, element: T): T[] {
  return array.map((value) => (value === old ? element : value));
}

export function deepFreeze<A>(object: A): Readonly<A> {
  for (const prop in object) {
    const value = object[prop];

    if (typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

function clone<A>(object: A, caches: unknown[]): A {
  if (typeof object !== 'object') {
    return object;
  }

  if (prototypeToString.call(object) === '[object Object]') {
    const [objectCache] = caches.filter((objectCache) => objectCache === object);

    if (objectCache) {
      return objectCache as A;
    }

    caches.push(object);
  }

  const prototypeObject = Object.getPrototypeOf(object);
  const constructorObject = prototypeObject.constructor;

  if (PRIMITIVES.includes(constructorObject)) {
    return new constructorObject(object);
  }

  const objectClone: A = new constructorObject();

  for (const prop in object) {
    objectClone[prop] = clone(object[prop], caches) as any;
  }

  return objectClone;
}

export function forEach<T>(array: T[], callEach: FnEach, callStop?: FnStop): boolean {
  try {
    array.forEach((element, index) => {
      const shouldStop = callEach(element, index);

      if (isDefined(shouldStop) && !shouldStop) {
        throw new ForEachBreakException(element, index);
      }
    });

    return true;
  } catch (error) {
    if (callStop && error instanceof ForEachBreakException) {
      callStop(error.element as T, error.index);
    }

    return false;
  }
}
