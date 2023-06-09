const primitivesClass = [Date, RegExp, Function, String, Boolean, Number];
const prototypeToString = Object.prototype.toString;

const falsyValue = ['false', 'undefined', '0', 0];

type PromisesFn<T extends any> = () => Promise<T>;

type PromisesConfig<T extends any> = {
  error: (_: any) => void;
  index: number;
  promises: PromisesFn<T>[];
  result: T[];
  success: (_: T[]) => void;
};

interface ArrayToMapProps<E, V> {
  elements: E[];
  getIdentifier: (element: E) => string;
  factory: (element: E) => V;
  reducer: (element: E, currentValue: V) => void;
}

type Calleable<T> = Undefined<(...args: any) => T>;

function clone<A>(object: A, caches: unknown[]): A {
  if (typeof object !== 'object') {
    return object;
  }

  if (prototypeToString.call(object) === '[object Object]') {
    const [cacheObject] = caches.filter((cacheObject) => cacheObject === object);

    if (cacheObject) {
      return cacheObject as A;
    }

    caches.push(object);
  }

  const prototypeObject = Object.getPrototypeOf(object);
  const ConstructorObject = prototypeObject.constructor;

  if (primitivesClass.includes(ConstructorObject)) {
    return new ConstructorObject(object);
  }

  const cloneObject: A = new ConstructorObject();

  for (const prop in object) {
    cloneObject[prop] = clone<any>(object[prop], caches);
  }

  return cloneObject;
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
  return !(isUndefined(value) || value === false || falsyValue.includes(value));
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

export function promiseFrom<M>(value: M | Promise<M>): Promise<M> {
  return value instanceof Promise ? value : Promise.resolve(value);
}

export function promisesZip<T = any>(promises: PromisesFn<T>[]): Promise<T[]> {
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

export function arrayToMapReduce<E, V>(props: ArrayToMapProps<E, V>): V[] {
  const { elements, factory, getIdentifier, reducer } = props;

  const map = new Map<string, V>();

  function getCurrentValue(element: E): V {
    const identifier = getIdentifier(element);

    const value = map.get(identifier);

    if (value) {
      return value;
    }

    const newValue = factory(element);

    map.set(identifier, newValue);

    return newValue;
  }

  elements.forEach((element) => {
    reducer(element, getCurrentValue(element));
  });

  return Array.from(map.entries()).map(([_, value]) => value);
}

export function callback<T = any>(call: Calleable<T>, ...args: any): Undefined<T> {
  return typeof call !== 'function' ? undefined : call.apply(call, args);
}
