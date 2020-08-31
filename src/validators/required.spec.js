import { required } from './required';

describe('required validator', () => {
  test('should return an object with the key [required]', () => {
    expect(required('')).toMatchObject({ required: true })
  });

  test('should return a key value of true if value is empty', () => {
    expect(required('').required).toBe(true);
  });

  test('should return a key value of false if value', () => {
    expect(required('test').required).toBe(false);
  });

  test('should return a key value of false if value is null or undefined', () => {
    expect(required(null).required).toBe(false);
    expect(required(undefined).required).toBe(false);
  });
});

