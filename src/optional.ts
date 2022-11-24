/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from './utils';

export abstract class Optional<T> {
  protected constructor() {}

  public abstract isPresent(): boolean;

  public abstract isEmpty(): boolean;

  public abstract get(): T;

  public static build<T>(value?: T | null): Optional<T> {
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
  constructor(private value: T) {
    super();
  }

  public isPresent(): boolean {
    return true;
  }

  public isEmpty(): boolean {
    return false;
  }

  public get(): T {
    return this.value;
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
