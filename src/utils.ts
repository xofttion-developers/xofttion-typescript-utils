const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];
const prototypeToString = Object.prototype.toString;

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
