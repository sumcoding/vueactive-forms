import { formGroup } from './formGroup';
import { FormKey } from './FormKey';

import { formInput } from './formInput';

describe('formGroup', () => {
  const value = 'value';
  const newValue = 'new value';

  const mockValidatorAsync = jest.fn(() => ({
    mockValidatorAsync: new Promise((resolve, reject) => {
      resolve(typeof value === 'string' && value === 'value');
    })
  }));
  const mockValidator = jest.fn((value) => ({ mockValidator: value !== 'value' }));

  const formSetup = {
    [FormKey.INVALID]: expect.any(Boolean),
    [FormKey.DIRTY]: expect.any(Boolean),
    [FormKey.CLEAN]: expect.any(Function),
    [FormKey.TOUCH]: expect.any(Function),
    [FormKey.RESET]: expect.any(Function),
    [FormKey.ERROR]: expect.any(Boolean),
  };

  const simpleValues = ['string', false, 1, value];
  const simple = {
    string: simpleValues[0],
    boolean: simpleValues[1],
    number: simpleValues[2]
  };
  const expectedSimpleFormInput = (value, org) => ({ [FormKey.ORIGINAL]: org || value, value, [FormKey.DIRTY]: false });

  const hasFormValidators = () => ({
    one: formInput(value, mockValidator),
    two: formInput(value, [mockValidator, mockValidatorAsync]),
  });

  const expectedValidationFormInput = (value, org) => ({ ...expectedSimpleFormInput(value, org), [FormKey.INVALID]: expect.any(Boolean), [FormKey.ERROR]: expect.any(Boolean) });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create a simple form input object for each key that is a string | boolean | number', () => {
    const result = formGroup(simple);

    expect(result).toMatchObject({
      string: expectedSimpleFormInput(simpleValues[0]),
      boolean: expectedSimpleFormInput(simpleValues[1]),
      number: expectedSimpleFormInput(simpleValues[2]),
      ...formSetup
    });
  });

  test('should have validation form input objects when used in conjunction with formInput and validators', () => {
    const result = formGroup(hasFormValidators());

    setImmediate(() => {
      expect(result).toMatchObject({
        one: { ...expectedValidationFormInput(value), mockValidator: false },
        two: { ...expectedValidationFormInput(value), mockValidator: false, mockValidatorAsync: true },
        ...formSetup,
        [FormKey.INVALID]: true,
        [FormKey.DIRTY]: false,
        [FormKey.ERROR]: false,
      });
    });
  });

  test(`should on ${FormKey.CLEAN}() should produce a new object with no FormKey's`, () => {
    const result = formGroup(hasFormValidators());
    const cleaned = result.$clean();

    expect(cleaned).toEqual(expect.not.objectContaining({
      one: { ...expectedValidationFormInput(value), mockValidator: false },
      two: { ...expectedValidationFormInput(value), mockValidator: false, mockValidatorAsync: true },
      ...formSetup,
    }));

    expect(cleaned).toEqual(expect.objectContaining({
      one: value,
      two: value,
    }));
  });

  test(`should on ${FormKey.TOUCH}() should set the ${FormKey.DIRTY} state on all form input objects`, () => {
    const result = formGroup(hasFormValidators());
    result.$touch();

    setImmediate(() => {
      expect(result).toMatchObject({
        one: { [FormKey.DIRTY]: true },
        two: { [FormKey.DIRTY]: true },
        [FormKey.DIRTY]: true,
        [FormKey.INVALID]: true,
        [FormKey.ERROR]: true,
      });
    });
  });


  test(`should update form object when a value is changed`, () => {
    const result = formGroup(hasFormValidators());
    result.one.value = newValue;
    setImmediate(() => {
      expect(result).toMatchObject({
        one: {
          ...expectedSimpleFormInput(newValue, value),
          mockValidator: true,
          [FormKey.DIRTY]: true,
          [FormKey.INVALID]: true,
          [FormKey.ERROR]: true,
        },
        two: { ...expectedValidationFormInput(value), mockValidator: false, mockValidatorAsync: true },
        [FormKey.DIRTY]: true,
        [FormKey.INVALID]: true,
        [FormKey.ERROR]: true,
      });
    })
  });

  test(`should on ${FormKey.RESET}() set any changes back to the initial values and set ${FormKey.DIRTY} and ${FormKey.ERROR} to false`, done => {
    const result = formGroup(hasFormValidators());
    setImmediate(() => {
      expect(result).toMatchObject({
        one: { ...expectedValidationFormInput(value), mockValidator: false },
        two: { ...expectedValidationFormInput(value), mockValidator: false, mockValidatorAsync: true },
        ...formSetup,
        [FormKey.INVALID]: true,
        [FormKey.DIRTY]: false,
        [FormKey.ERROR]: false,
      });
    });

    setImmediate(() => {
      result.one.value = newValue;
    });

    setImmediate(() => {
      expect(result).toMatchObject({
        one: {
          ...expectedSimpleFormInput(newValue, value),
          mockValidator: true,
          [FormKey.DIRTY]: true,
          [FormKey.INVALID]: true,
          [FormKey.ERROR]: true,
        },
        two: { ...expectedValidationFormInput(value), mockValidator: false, mockValidatorAsync: true },
        [FormKey.DIRTY]: true,
        [FormKey.ERROR]: true,
      });
    });

    setImmediate(() => {
      result.$reset();
      setImmediate(() => {
        expect(result).toMatchObject({
          one: { ...expectedValidationFormInput(value), mockValidator: false },
          two: { ...expectedValidationFormInput(value), mockValidator: false, mockValidatorAsync: true },
          ...formSetup,
          [FormKey.DIRTY]: false,
          [FormKey.ERROR]: false,
        });
      });
      done();
    });
  });
});