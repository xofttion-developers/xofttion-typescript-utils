declare global {
  interface Array<T> {
    empty: boolean;

    exists(element: T): boolean;

    firstElement(): T | null;

    lastElement(): T | null;

    remove(index: number | T): T[];
  }
}

export {};
