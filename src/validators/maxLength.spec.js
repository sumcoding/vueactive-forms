import { maxLength } from './maxLength';

describe('maxLength validator', () => {
  const max = 4;
  test('should return an object with the key [maxLength]', () => {
    expect(maxLength(max)('value')).toMatchObject({ maxLength: expect.any(Boolean) })
  });

  test('should should take a number and return a function', () => {
    const setup = maxLength(max);
    expect(typeof setup === 'function').toBe(true);
  });

  test('should return a key value of false if value is less then number provided', () => {
    const setup = maxLength(max);
    expect(setup('').maxLength).toBe(false);
  });

  test('should return a key value of true if value is more then number provided', () => {
    const setup = maxLength(max);
    expect(setup('12345').maxLength).toBe(true);
  });
});

