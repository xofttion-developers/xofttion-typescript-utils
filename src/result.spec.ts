import { Result } from './result';

describe('Result', () => {
  it('should eval result right successful', () => {
    Result.success(10).when((value) => {
      expect(value).toBe(10);
    });
  });

  it('should eval result left successful', () => {
    Result.failure(10).when(
      (_) => {},
      (value) => {
        expect(value).toBe(10);
      }
    );
  });

  it('should result left undefined successful', () => {
    const result = Result.failure(10).when((_) => {});

    expect(result).toBeUndefined();
  });
});
