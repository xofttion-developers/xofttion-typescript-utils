import { isDefined } from './utils';

type Loading<L> = {
  failure?: never;
  loading: L;
  success?: never;
};

type Failure<F> = {
  failure: F;
  loading?: never;
  success?: never;
};

type Success<S> = {
  failure?: never;
  loading?: never;
  success: S;
};

type ResultValue<L, F, S> = NonNullable<Loading<L> | Failure<F> | Success<S>>;

type ResultEval = <L, F, S>(value: ResultValue<L, F, S>) => NonNullable<L | F | S>;

type LoadingFn<L, V> = (_: L) => V;

type FailureFn<F, V> = (_: F) => V;

type SuccessFn<S, V> = (_: S) => V;

const evalAsyncState: ResultEval = <L, F, S>(value: ResultValue<L, F, S>) => {
  const { failure, loading, success } = value;

  /* istanbul ignore next */
  if (isDefined(loading) && isDefined(success) && isDefined(failure)) {
    throw new Error('Received both failure and success values at runtime');
  }

  /* istanbul ignore else */
  if (isDefined(loading)) {
    return loading as NonNullable<L>;
  }

  /* istanbul ignore else */
  if (isDefined(failure)) {
    return failure as NonNullable<F>;
  }

  /* istanbul ignore else */
  if (isDefined(success)) {
    return success as NonNullable<S>;
  }

  /* istanbul ignore next */
  throw new Error(
    'Received no failure or success values at runtime when opening Either'
  );
};

function isLoading<L, F, S>(value: ResultValue<L, F, S>): value is Loading<L> {
  return isDefined(value.loading);
}

function isFailure<L, F, S>(value: ResultValue<L, F, S>): value is Failure<F> {
  return isDefined(value.failure);
}

function isSuccess<L, F, S>(value: ResultValue<L, F, S>): value is Success<S> {
  return isDefined(value.success);
}

function createLoading<L>(loading: L): Loading<L> {
  return { loading };
}

function createFailure<F>(failure: F): Failure<F> {
  return { failure };
}

function createSuccess<R>(success: R): Success<R> {
  return { success };
}

export class AsyncState<L, F, S> {
  private constructor(private value: ResultValue<L, F, S>) {}

  public when<V>(
    loading: LoadingFn<L, V>,
    success: SuccessFn<S, V>,
    failure: FailureFn<F, V>
  ): V {
    /* istanbul ignore else */
    if (isLoading(this.value)) {
      return loading(evalAsyncState(this.value));
    }

    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      return success(evalAsyncState(this.value));
    }

    /* istanbul ignore else */
    if (isFailure(this.value)) {
      return failure(evalAsyncState(this.value));
    }

    throw Error('No value is returned at runtime from AsyncState');
  }

  public static loading<L>(value: L): AsyncState<L, unknown, unknown> {
    return new AsyncState(createLoading<L>(value));
  }

  public static failure<F>(value: F): AsyncState<unknown, F, unknown> {
    return new AsyncState(createFailure<F>(value));
  }

  public static success<S>(value: S): AsyncState<unknown, unknown, S> {
    return new AsyncState(createSuccess<S>(value));
  }
}
