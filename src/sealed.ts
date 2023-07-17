export interface StateSealed<R> {
  [key: string]: (value?: any) => R;
}

export class Sealed<R, V, T extends StateSealed<R>> {
  protected constructor(private key: keyof T, private value?: V) {}

  public when(resolver: T, otherwise?: () => void): R {
    const handler = resolver[this.key];

    if (otherwise) {
      otherwise();
    }

    if (handler) {
      return handler(this.value as any);
    }

    throw Error('Sealed class could not resolve call');
  }
}
