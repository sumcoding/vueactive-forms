import { numeric } from './numeric';

describe('numeric validator', () => {
  const value = 4;
  test('should return an object with the key [numeric]', () => {
    expect(numeric(value)).toMatchObject({ numeric: expect.any(Boolean) })
  });

  test('should return a key value of false if value is a number', () => {
    expect(numeric(value).numeric).toBe(false);
  });

  test('should return a key value of true if value is not a number', () => {
    expect(numeric('string').numeric).toBe(true);
  });
});
