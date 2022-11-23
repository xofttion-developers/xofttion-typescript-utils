const PRIMITIVES = [Date, RegExp, Function, String, Boolean, Number];
const prototypeToString = Object.prototype.toString;

function cloneObject<T>(object: Undefined<T>, caches: unknown[]): Undefined<T> {
  if (typeof object !== 'object') {
    return object;
  }

  if (prototypeToString.call(object) === '[object Object]') {
    const [objectCache] = caches.filter((objectCache) => objectCache === object);

    if (objectCache) {
      return objectCache as T;
    }

    caches.push(object);
  }

  const prototypeObject = Object.getPrototypeOf(object);
  const constructorObject = prototypeObject.constructor;

  if (PRIMITIVES.includes(constructorObject)) {
    return new constructorObject(object);
  }

  const objectClone: T = new constructorObject();

  for (const prop in object) {
    objectClone[prop] = cloneObject(object[prop], caches) as any;
  }

  return objectClone;
}

export function deepClone<T>(object: Undefined<T>): Undefined<T> {
  return cloneObject(object, []);
}
