import { isDefined } from './utils';

type Failure<F> = {
  failure: F;
  success?: never;
};

type Success<S> = {
  failure?: never;
  success: S;
};

type ResultValue<F, S> = NonNullable<Failure<F> | Success<S>>;

type ResultEval = <F, S>(value: ResultValue<F, S>) => NonNullable<F | S>;

type FailureFn<F, V> = (_: F) => V;

type SuccessFn<S, V> = (_: S) => V;

const evalResult: ResultEval = <F, S>(value: ResultValue<F, S>) => {
  const { failure, success } = value;

  /* istanbul ignore next */
  if (isDefined(success) && isDefined(failure)) {
    throw new Error('Received both failure and success values at runtime');
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
    'Received no failure or success values at runtime when opening Result'
  );
};

function isFailure<F, S>(value: ResultValue<F, S>): value is Failure<F> {
  return isDefined(value.failure);
}

function isSuccess<F, S>(value: ResultValue<F, S>): value is Success<S> {
  return isDefined(value.success);
}

function createFailure<F>(failure: F): Failure<F> {
  return { failure };
}

function createSuccess<S>(success: S): Success<S> {
  return { success };
}

export class Result<F, S> {
  private constructor(private value: ResultValue<F, S>) {}

  public when<V>(success: SuccessFn<S, V>, failure?: FailureFn<F, V>): Undefined<V> {
    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      return success(evalResult(this.value));
    }

    /* istanbul ignore else */
    if (isFailure(this.value) && failure) {
      return failure(evalResult(this.value));
    }

    return undefined;
  }

  public static failure<F>(value: F): Result<F, unknown> {
    return new Result(createFailure<F>(value));
  }

  public static success<S>(value: S): Result<unknown, S> {
    return new Result(createSuccess<S>(value));
  }
}

export class ResultPresent<F, S> {
  private constructor(private value: ResultValue<F, S>) {}

  public when<V>(success: SuccessFn<S, V>, failure?: FailureFn<F, V>): V {
    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      return success(evalResult(this.value));
    }

    /* istanbul ignore else */
    if (isFailure(this.value) && failure) {
      return failure(evalResult(this.value));
    }

    throw Error('No value is returned at runtime from Result');
  }

  public static failure<F>(value: F): ResultPresent<F, unknown> {
    return new ResultPresent(createFailure<F>(value));
  }

  public static success<S>(value: S): ResultPresent<unknown, S> {
    return new ResultPresent(createSuccess<S>(value));
  }
}

export class ResultEmpty<F, S> {
  private constructor(private value: ResultValue<F, S>) {}

  public when(success: SuccessFn<S, void>, failure?: FailureFn<F, void>): void {
    /* istanbul ignore else */
    if (isSuccess(this.value)) {
      success(evalResult(this.value));
      return undefined;
    }

    /* istanbul ignore else */
    if (isFailure(this.value) && failure) {
      failure(evalResult(this.value));
      return undefined;
    }
  }

  public static failure<F>(value: F): ResultEmpty<F, unknown> {
    return new ResultEmpty(createFailure<F>(value));
  }

  public static success<S>(value: S): ResultEmpty<unknown, S> {
    return new ResultEmpty(createSuccess<S>(value));
  }
}
