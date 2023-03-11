const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];
const prototypeToString = Object.prototype.toString;

const FALSY_VALUES = ['false', 'undefined', '0', 0];

type PromisesFn<T extends any> = () => Promise<T>;

type PromisesConfig<T extends any> = {
  error: (_: any) => void;
  index: number;
  promises: PromisesFn<T>[];
  result: T[];
  success: (_: T[]) => void;
};

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
