declare global {
  interface Array<T> {
    empty: boolean;

    exists(element: T): boolean;

    first(): T | null;

    last(): T | null;

    remove(index: number | T): T[];
  }
}

export {};
