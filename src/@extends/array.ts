Object.defineProperty(Array.prototype, 'empty', {
  get: function () {
    return this.length === 0;
  },
  enumerable: false,
  configurable: true
});

Array.prototype.exists = function <T>(element: T): boolean {
  return this.indexOf(element) !== -1;
};

Array.prototype.firstElement = function <T>(): T | null {
  return this.empty ? null : this[0];
};

Array.prototype.lastElement = function <T>(): T | null {
  return this.empty ? null : this[this.length - 1];
};

Array.prototype.remove = function <T>(value: number | T): T[] {
  const index = typeof value === 'number' ? value : this.indexOf(value);

  return this.splice(index, 1);
};

export {};
