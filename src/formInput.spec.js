import { reactive, toRefs } from 'vue';
import {
  setSimpleInputObject,
  setValidationInputObject,
  setInputValues,
  setValidator,
  formInputSimple,
  formInputValidator,
  formInputValidatorsArray,
  formInput
} from './formInput';
import { FormKey } from './FormKey';
import { required } from './validators';

describe('formInput', () => {
  const value = 'value';
  const mockValidatorAsync = jest.fn(() => ({
    mockValidatorAsync: new Promise((resolve, reject) => {
      resolve(typeof value === 'string' && value === 'value');
    })
  }));
  const mockValidator = jest.fn((value) => ({ mockValidator: value !== 'value' }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setSimpleInputObject', () => {
    test('should create a simple form input object with the value set', () => {
      expect(setSimpleInputObject(value)).toMatchObject({ [FormKey.ORIGINAL]: value, value, [FormKey.DIRTY]: null })
    });
  });

  describe('setValidationInputObject', () => {
    test('should create a validation form input object', () => {
      expect(setValidationInputObject(value)).toMatchObject({ [FormKey.INVALID]: null, [FormKey.ERROR]: null, ...setSimpleInputObject(value) })
    });
  });

  describe('setValidator', () => {
    test('should set validator object', async () => {
      const validation = await setValidator(required, value);
      expect(validation).toMatchObject({ required: false })
    });

    test('should resolve promise when setting validator object', async () => {
      const validation = await setValidator(mockValidatorAsync, value);
      expect(mockValidatorAsync).toHaveBeenCalled();
      expect(validation).toMatchObject({ mockValidatorAsync: true })
    });
  });

  describe('setInputValues', () => {
    test('should update ref with changes when new value is set', () => {
      const value$ = reactive({ ...setValidationInputObject(value), required: false });
      const refValue$ = toRefs(value$);
      expect(refValue$.value['_object']).toMatchObject({
        [FormKey.INVALID]: null,
        [FormKey.ERROR]: null,
        [FormKey.ORIGINAL]: value,
        value,
        [FormKey.DIRTY]: null,
        required: false
      });
      refValue$.value.value = '';
      setInputValues(refValue$, { required: true });
      expect(refValue$.value['_object']).toMatchObject({
        [FormKey.INVALID]: true,
        [FormKey.ERROR]: true,
        [FormKey.ORIGINAL]: value,
        value: '',
        [FormKey.DIRTY]: true,
        required: true
      });
    });
  });

  describe('formInputSimple', () => {
    test('should set ref with simple input object', () => {
      const result = formInputSimple(value);

      expect(result).toMatchObject({
        [FormKey.ORIGINAL]: value,
        value,
        [FormKey.DIRTY]: false,
      });
    });

    test('should update ref with changes when new value is set', async () => {
      const newValue = 'new value';
      const result = formInputSimple(value);

      result.value = newValue;

      process.nextTick(() =>
        expect(result).toMatchObject({
          [FormKey.ORIGINAL]: value,
          value: newValue,
          [FormKey.DIRTY]: true,
        })
      );
    });
  });

  describe('formInputValidator', () => {
    test('should set ref with validation input object', () => {
      const result = formInputValidator(value, mockValidator);

      expect(mockValidator).toHaveBeenCalled();
      process.nextTick(() => {
        expect(result).toMatchObject({
          [FormKey.INVALID]: false,
          [FormKey.ERROR]: false,
          [FormKey.ORIGINAL]: value,
          value,
          [FormKey.DIRTY]: false,
          mockValidator: false
        });
      });
    });

    test('should update ref with changes when new value is set', async () => {
      const newValue = '';
      const result = formInputValidator(value, mockValidator);
      expect(mockValidator).toHaveBeenCalled();

      result.value = newValue;

      process.nextTick(() => {
        expect(result).toMatchObject({
          [FormKey.INVALID]: true,
          [FormKey.ERROR]: true,
          [FormKey.ORIGINAL]: value,
          value: newValue,
          [FormKey.DIRTY]: true,
          mockValidator: true
        })
      });
    });
  });

  describe('formInputValidatorsArray', () => {
    test('should set ref with validation input object', () => {
      const result = formInputValidatorsArray(value, [mockValidator, mockValidatorAsync]);
      expect(mockValidator).toHaveBeenCalled();
      expect(mockValidatorAsync).toHaveBeenCalled();

      process.nextTick(() => {
        expect(result).toMatchObject({
          [FormKey.INVALID]: true,
          [FormKey.ERROR]: false,
          [FormKey.ORIGINAL]: value,
          value,
          [FormKey.DIRTY]: false,
          mockValidator: false,
          mockValidatorAsync: true
        });
      });
    });

    test('should update ref with changes when new value is set', async () => {
      const newValue = '';
      const result = formInputValidatorsArray(value, [mockValidator, mockValidatorAsync]);
      expect(mockValidator).toHaveBeenCalled();
      expect(mockValidatorAsync).toHaveBeenCalled();

      result.value = newValue;

      process.nextTick(() => {
        expect(result).toMatchObject({
          [FormKey.INVALID]: true,
          [FormKey.ERROR]: true,
          [FormKey.ORIGINAL]: value,
          value: newValue,
          [FormKey.DIRTY]: true,
          mockValidator: true,
          mockValidatorAsync: true,
        })
      });
    });
  });

  describe('formInput', () => {
    test('should return a simple object if no validators are present', () => {
      const result = formInput(value);
      expect(result).toMatchObject({ [FormKey.ORIGINAL]: value, value, [FormKey.DIRTY]: false });
    });

    test('should return a validation input object if validators are present', async () => {
      const result = formInput(value, [mockValidator, mockValidatorAsync]);

      process.nextTick(() => {
        expect(result).toMatchObject({
          [FormKey.INVALID]: true,
          [FormKey.ERROR]: false,
          [FormKey.ORIGINAL]: value,
          value,
          [FormKey.DIRTY]: false,
          mockValidator: false,
          mockValidatorAsync: true,
        })
      });
    });
  });
});

