import { maxValue } from './maxValue';

describe('maxValue validator', () => {
  const max = 4;
  test('should return an object with the key [maxValue]', () => {
    expect(maxValue(max)(5)).toMatchObject({ maxValue: expect.any(Boolean) })
  });

  test('should should take a number and return a function', () => {
    const setup = maxValue(max);
    expect(typeof setup === 'function').toBe(true);
  });

  test('should return a key value of false if value is less then number provided', () => {
    const setup = maxValue(max);
    expect(setup(2).maxValue).toBe(false);
  });

  test('should return a key value of true if value is more then number provided', () => {
    const setup = maxValue(max);
    expect(setup(5).maxValue).toBe(true);
  });
});

