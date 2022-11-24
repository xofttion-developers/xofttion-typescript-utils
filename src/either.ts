import { isDefined } from './utils';
import { Optional } from './optional';

type Left<L> = {
  left: L;
  right?: never;
};

type Right<R> = {
  left?: never;
  right: R;
};

type UnwrapEitherValue = <L, R>(value: EitherValue<L, R>) => NonNullable<L | R>;

type EitherValue<L, R> = NonNullable<Left<L> | Right<R>>;

interface EitherResolver<L, R, V> {
  left?: (_: L) => Undefined<V>;
  right?: (_: R) => Undefined<V>;
}

const unwrapEither: UnwrapEitherValue = <L, R>(value: EitherValue<L, R>) => {
  const { left, right } = value;

  if (isDefined(right) && isDefined(left)) {
    throw new Error('Received both left and right values at runtime');
  }

  if (isDefined(left)) {
    return left as NonNullable<L>;
  }

  if (isDefined(right)) {
    return right as NonNullable<R>;
  }

  throw new Error('Received no left or right values at runtime when opening Either');
};

const isLeft = <L, R>(value: EitherValue<L, R>): value is Left<L> => {
  return isDefined(value.left);
};

const isRight = <L, R>(value: EitherValue<L, R>): value is Right<R> => {
  return isDefined(value.right);
};

const createLeft = <L>(value: L): Left<L> => ({ left: value });

const createRight = <R>(value: R): Right<R> => ({ right: value });

export class Either<L, R> {
  private constructor(private value: EitherValue<L, R>) {}

  public fold<V>(resolver: EitherResolver<L, R, V>): Undefined<V> {
    return this._unwrap(resolver);
  }

  public promise<V>(resolver: EitherResolver<L, R, V>): Promise<Undefined<V>> {
    return Promise.resolve(this.fold(resolver));
  }

  public optional<V>(resolver: EitherResolver<L, R, V>): Optional<V> {
    return Optional.build(this.fold(resolver));
  }

  private _unwrap<V>(resolver: EitherResolver<L, R, V>): Undefined<V> {
    if (isRight(this.value) && resolver.right) {
      return resolver.right(unwrapEither(this.value));
    }

    if (isLeft(this.value) && resolver.left) {
      return resolver.left(unwrapEither(this.value));
    }

    return undefined;
  }

  public static left<L>(value: L): Either<L, unknown> {
    return new Either(createLeft<L>(value));
  }

  public static right<R>(value: R): Either<unknown, R> {
    return new Either(createRight<R>(value));
  }
}
