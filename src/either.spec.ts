import { Either } from './either';

describe('Either', () => {
  it('should eval success successful', () => {
    Either.success(10).when({
      success: (value) => {
        expect(value).toBe(10);
      },
      failure: () => {
        // Failure process
      }
    });
  });

  it('should eval failure successful', () => {
    Either.failure(10).when({
      success: () => {
        // Success process
      },
      failure: (value) => {
        expect(value).toBe(10);
      }
    });
  });

  it('should failure undefined successful', () => {
    const result = Either.failure(10).when({
      success: () => {},
      failure: () => {}
    });

    expect(result).toBeUndefined();
  });
});
