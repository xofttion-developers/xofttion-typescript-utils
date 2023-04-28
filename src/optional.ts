import { isDefined } from './utils';

type EmptyFn<V> = () => V;

type PresentFn<P, V> = (_: P) => V;

export abstract class Optional<T> {
  protected constructor(public readonly value?: T) {}

  public abstract isPresent(): boolean;

  public abstract isEmpty(): boolean;

  public abstract get(): T;

  public present(call: (value: T) => void): void {
    if (this.isPresent()) {
      call(this.get());
    }
  }

  public empty(call: () => void): void {
    if (this.isEmpty()) {
      call();
    }
  }

  public when<V = unknown>(present: PresentFn<T, V>, empty: EmptyFn<V>): V {
    return this.isPresent() ? present(this.get()) : empty();
  }

  public static build<T>(value?: Nulleable<T>): Optional<T> {
    return isDefined(value) ? this.of(value as T) : this.empty();
  }

  public static of<T>(value: T): Optional<T> {
    if (isDefined(value)) {
      return new PresentOptional<T>(value);
    }

    throw new Error('The passed value was null or undefined.');
  }

  public static empty<T>(): Optional<T> {
    return new EmptyOptional();
  }
}

class PresentOptional<T> extends Optional<T> {
  constructor(private valuePresent: T) {
    super(valuePresent);
  }

  public isPresent(): boolean {
    return true;
  }

  public isEmpty(): boolean {
    return false;
  }

  public get(): T {
    return this.valuePresent;
  }
}

class EmptyOptional<T> extends Optional<T> {
  public isPresent(): boolean {
    return false;
  }

  public isEmpty(): boolean {
    return true;
  }

  public get(): T {
    throw new Error('The optional is not present.');
  }
}
