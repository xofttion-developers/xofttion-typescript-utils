type Loading<L> = {
  failure?: never;
  loading?: L;
  success?: never;
};

type Failure<F> = {
  failure?: F;
  loading?: never;
  success?: never;
};

type Success<S> = {
  failure?: never;
  loading?: never;
  success?: S;
};

type ResultValue<L, F, S> = NonNullable<Loading<L> | Failure<F> | Success<S>>;

type ResultEval = <L, F, S>(value: ResultValue<L, F, S>) => NonNullable<L | F | S>;

type LoadingFn<L, V> = (_: L) => V;

type FailureFn<F, V> = (_: F) => V;

type SuccessFn<S, V> = (_: S) => V;

const getValueAsyncState: ResultEval = <L, F, S>(value: ResultValue<L, F, S>) => {
  /* istanbul ignore next */
  if (isLoading(value) && isFailure(value) && isSuccess(value)) {
    throw new Error('Received both loading, failure and success values at runtime');
  }

  /* istanbul ignore else */
  if (isLoading(value)) {
    return value.loading as NonNullable<L>;
  }

  /* istanbul ignore else */
  if (isFailure(value)) {
    return value.failure as NonNullable<F>;
  }

  /* istanbul ignore else */
  if (isSuccess(value)) {
    return value.success as NonNullable<S>;
  }

  /* istanbul ignore next */
  throw new Error(
    'Received no loading, failure or success values at runtime when opening AsyncState'
  );
};

function isLoading<L, F, S>(value: ResultValue<L, F, S>): value is Loading<L> {
  return 'loading' in value;
}

function isFailure<L, F, S>(value: ResultValue<L, F, S>): value is Failure<F> {
  return 'failure' in value;
}

function isSuccess<L, F, S>(value: ResultValue<L, F, S>): value is Success<S> {
  return 'success' in value;
}

function createLoading<L>(loading?: L): Loading<L> {
  return { loading };
}

function createFailure<F>(failure?: F): Failure<F> {
  return { failure };
}

function createSuccess<R>(success?: R): Success<R> {
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
      return loading(getValueAsyncState(this.value));
    }

    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      return success(getValueAsyncState(this.value));
    }

    /* istanbul ignore else */
    if (isFailure(this.value)) {
      return failure(getValueAsyncState(this.value));
    }

    throw Error('No value is returned at runtime from AsyncState');
  }

  public static loading<L>(value?: L): AsyncState<L, any, any> {
    return new AsyncState(createLoading<L>(value));
  }

  public static failure<F>(value?: F): AsyncState<any, F, any> {
    return new AsyncState(createFailure<F>(value));
  }

  public static success<S>(value?: S): AsyncState<any, any, S> {
    return new AsyncState(createSuccess<S>(value));
  }
}
