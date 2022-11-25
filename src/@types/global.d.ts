declare global {
  type Undefined<T> = T | undefined;

  type Nulleable<T> = T | null;
}

export {};
