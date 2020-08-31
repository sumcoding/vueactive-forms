import { minValue } from './minValue';

describe('minValue validator', () => {
  const min = 4;
  test('should return an object with the key [minValue]', () => {
    const setup = minValue(min);
    expect(setup(4)).toMatchObject({ minValue: expect.any(Boolean) })
  });

  test('should should take a number and return a function', () => {
    const setup = minValue(min);
    expect(typeof setup === 'function').toBe(true);
  });

  test('should return a key value of false if value is more then number provided', () => {
    const setup = minValue(min);
    expect(setup(5).minValue).toBe(false);
  });

  test('should return a key value of true if value is less then number provided', () => {
    const setup = minValue(min);
    expect(setup(3).minValue).toBe(true);
  });
});
