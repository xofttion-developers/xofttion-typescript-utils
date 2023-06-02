export interface StateSealed<R> {
  [key: string]: (value?: any) => R;
}

type Constructor<C, T> = { new (key: keyof T, value?: any): C };

export class Sealed<R, T extends StateSealed<R>> {
  constructor(private key: keyof T, private value?: any) {}

  public when(resolver: T): R {
    const handler = resolver[this.key];

    if (handler) {
      handler(this.value);
    }

    throw Error('Could not resolve call to get a result');
  }

  public static create<C, T>(this: Constructor<C, T>, key: keyof T, value?: any): C {
    return new this(key, value);
  }
}
