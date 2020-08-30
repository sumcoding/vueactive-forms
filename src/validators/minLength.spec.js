import { minLength } from './minLength';

describe('minLength validator', () => {
  const min = 4;
  test('should return an object with the key [minLength]', () => {
    expect(minLength(min)('value')).toMatchObject({ minLength: expect.any(Boolean) })
  });

  test('should should take a number and return a function', () => {
    const setup = minLength(min);
    expect(typeof setup === 'function').toBe(true);
  });

  test('should return a key value of false if value is more then number provided', () => {
    const setup = minLength(min);
    expect(setup('12345').minLength).toBe(false);
  });

  test('should return a key value of true if value is less then number provided', () => {
    const setup = minLength(min);
    expect(setup('').minLength).toBe(true);
  });
});
