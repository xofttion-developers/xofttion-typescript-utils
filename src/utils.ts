const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];
const prototypeToString = Object.prototype.toString;

const FALSY_VALUES = ['false', 'undefined', '0', 0];

type EachFn = <T>(el: T, index: number) => Undefined<boolean>;
type StopFn = <T>(el: T, index: number) => void;
type PromisesFn<T extends any> = () => Promise<T>;

type PromisesConfig<T extends any> = {
  error: (_: any) => void;
  index: number;
  promises: PromisesFn<T>[];
  result: T[];
  success: (_: T[]) => void;
};

class ForEachBreakException<T> extends Error {
  constructor(public readonly element: T, public readonly index: number) {
    super('');
  }
}

function clone<A>(object: A, caches: unknown[]): A {
  if (typeof object !== 'object') {
    return object;
  }

  if (prototypeToString.call(object) === '[object Object]') {
    const [objCache] = caches.filter((objCache) => objCache === object);

    if (objCache) {
      return objCache as A;
    }

    caches.push(object);
  }

  const objPrototype = Object.getPrototypeOf(object);
  const objConstructor = objPrototype.constructor;

  if (PRIMITIVES.includes(objConstructor)) {
    return new objConstructor(object);
  }

  const objClone: A = new objConstructor();

  for (const prop in object) {
    objClone[prop] = clone<any>(object[prop], caches);
  }

  return objClone;
}

function executePromises<T extends any>(config: PromisesConfig<T>): void {
  const { error, index, promises, result, success } = config;

  if (index === promises.length) {
    success(result);
  } else {
    new Promise(() => {
      promises[index]()
        .then((value) => {
          executePromises({
            error,
            index: index + 1,
            promises,
            result: [...result, value],
            success
          });
        })
        .catch((ex) => {
          error(ex);
        });
    });
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

export function pushElement<T>(array: T[], element: T): T[] {
  return [...array, element];
}

export function removeElement<T>(array: T[], element: T): T[] {
  return array.filter((value) => value !== element);
}

export function changeElement<T>(array: T[], old: T, element: T): T[] {
  return array.map((value) => (value === old ? element : value));
}

export function each<T>(array: T[], callEach: EachFn, callStop?: StopFn): boolean {
  try {
    array.forEach((element, index) => {
      const stop = callEach(element, index);

      if (!!stop) {
        throw new ForEachBreakException(element, index);
      }
    });

    return true;
  } catch (error) {
    if (callStop && error instanceof ForEachBreakException<T>) {
      callStop(error.element, error.index);
    }

    return false;
  }
}

export function deepClone<A>(object: A): A {
  return clone(object, []);
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

export function parse<T>(value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export function promisesZip<T extends any>(promises: PromisesFn<T>[]): Promise<T[]> {
  return promises.length
    ? new Promise((resolve, reject) => {
        executePromises({
          error: (ex) => {
            reject(ex);
          },
          index: 0,
          result: [],
          promises,
          success: (result) => {
            resolve(result);
          }
        });
      })
    : Promise.resolve([]);
}
