type Failure<F> = {
  failure?: F;
  success?: never;
};

type Success<S> = {
  failure?: never;
  success?: S;
};

type ResultValue<F, S> = NonNullable<Failure<F> | Success<S>>;

type ResultEval = <F, S>(value: ResultValue<F, S>) => NonNullable<F | S>;

type FailureFn<F, V> = (_: F) => V;

type SuccessFn<S, V> = (_: S) => V;

const getResultValue: ResultEval = <F, S>(value: ResultValue<F, S>) => {
  /* istanbul ignore next */
  if (isFailure(value) && isSuccess(value)) {
    throw new Error('Received both failure and success values at runtime');
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
    'Received no failure or success values at runtime when opening Result'
  );
};

function isFailure<F, S>(value: ResultValue<F, S>): value is Failure<F> {
  return 'failure' in value;
}

function isSuccess<F, S>(value: ResultValue<F, S>): value is Success<S> {
  return 'success' in value;
}

function createFailure<F>(failure?: F): Failure<F> {
  return { failure };
}

function createSuccess<S>(success?: S): Success<S> {
  return { success };
}

export class Result<F = unknown, S = unknown> {
  private constructor(private value: ResultValue<F, S>) {}

  public when<V>(success: SuccessFn<S, V>, failure?: FailureFn<F, V>): Undefined<V> {
    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      return success(getResultValue(this.value));
    }

    /* istanbul ignore else */
    if (isFailure(this.value) && failure) {
      return failure(getResultValue(this.value));
    }

    return undefined;
  }

  public static failure<F = unknown>(value?: F): Result<F, any> {
    return new Result(createFailure<F>(value));
  }

  public static success<S = unknown>(value?: S): Result<any, S> {
    return new Result(createSuccess<S>(value));
  }
}

export class ResultPresent<F = unknown, S = unknown> {
  private constructor(private value: ResultValue<F, S>) {}

  public when<V>(success: SuccessFn<S, V>, failure?: FailureFn<F, V>): V {
    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      return success(getResultValue(this.value));
    }

    /* istanbul ignore else */
    if (isFailure(this.value) && failure) {
      return failure(getResultValue(this.value));
    }

    throw Error('No value is returned at runtime from Result');
  }

  public static failure<F = unknown>(value?: F): ResultPresent<F, any> {
    return new ResultPresent(createFailure<F>(value));
  }

  public static success<S = unknown>(value?: S): ResultPresent<any, S> {
    return new ResultPresent(createSuccess<S>(value));
  }
}

export class ResultEmpty<F = unknown, S = unknown> {
  private constructor(private value: ResultValue<F, S>) {}

  public when(success: SuccessFn<S, void>, failure?: FailureFn<F, void>): void {
    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      success(getResultValue(this.value));
      return undefined;
    }

    /* istanbul ignore else */
    if (isFailure(this.value) && failure) {
      failure(getResultValue(this.value));
      return undefined;
    }
  }

  public static failure<F = unknown>(value?: F): ResultEmpty<F, any> {
    return new ResultEmpty(createFailure<F>(value));
  }

  public static success<S = unknown>(value?: S): ResultEmpty<any, S> {
    return new ResultEmpty(createSuccess<S>(value));
  }
}
