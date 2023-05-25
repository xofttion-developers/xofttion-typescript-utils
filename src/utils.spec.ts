import { callback } from './utils';

describe('Utils', () => {
  it('should calculate value successful', () => {
    function multiply(a: number, b: number): number {
      return a * b;
    }

    const resultValue = callback<number>(multiply, 5, 7);

    expect(resultValue).toBe(35);

    const resultUndefined = callback(undefined, 5, 7);

    expect(resultUndefined).toBeUndefined();
  });
});
