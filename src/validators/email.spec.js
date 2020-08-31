import { email } from './email';

describe('email validator', () => {
  const value = 'test@test.com';
  test('should return an object with the key [email]', () => {
    expect(email(value)).toMatchObject({ email: expect.any(Boolean) })
  });

  test('should return a key value of false if value is a valid email', () => {
    expect(email(value).email).toBe(false);
  });

  test('should return a key value of true if value is and invalid email', () => {
    expect(email('th,@test.com').email).toBe(true);
  });
});

