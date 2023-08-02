import { Sealed } from './sealed';

export class ViewState<L, S, E, F, V = any> extends Sealed<
  V,
  S | F,
  {
    loading: (state: L) => V;
    success: (state: S) => V;
    empty: (state: E) => V;
    failure: (state: F) => V;
  }
> {
  public static loading<L>(value?: L): ViewState<L, any, any, any> {
    return new ViewState('loading', value);
  }

  public static success<S>(value?: S): ViewState<any, S, any, any> {
    return new ViewState('success', value);
  }

  public static empty<E>(value?: E): ViewState<any, any, E, any> {
    return new ViewState('empty', value);
  }

  public static failure<F>(value?: F): ViewState<any, any, any, F> {
    return new ViewState('failure', value);
  }
}
