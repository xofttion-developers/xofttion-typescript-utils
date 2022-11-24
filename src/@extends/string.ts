Object.defineProperty(String.prototype, 'empty', {
  get: function () {
    return this.length === 0;
  },
  enumerable: false,
  configurable: true
});

String.prototype.firstChar = function (): string {
  return this.empty ? '' : this.charAt(0);
};

String.prototype.lastChar = function (): string {
  return this.empty ? '' : this.charAt(this.length - 1);
};

export {};
