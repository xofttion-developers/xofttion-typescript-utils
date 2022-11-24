declare global {
  interface String {
    empty: boolean;

    firstChar(): string;

    lastChar(): string;
  }
}

export {};
