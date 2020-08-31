import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { hasKey } from './utils';

export const setSimpleInputObject = (value) => ({ [FormKey.ORIGINAL]: value, value, [FormKey.DIRTY]: null })
export const setValidationInputObject = (value) => ({ [FormKey.INVALID]: null, [FormKey.ERROR]: null, ...setSimpleInputObject(value) });

export const setInputValues = (input$, validations) => {
  /** check if any validation is returning true */
  input$[FormKey.INVALID].value = Object.entries(validations).map(
    ([key, value]) => typeof value === 'object' && hasKey(FormKey.ERROR, value) ? value[FormKey.ERROR] : value
  ).includes(true);

  /** Set validation attributes on change */
  Object.entries(validations)
    .map(([key, value]) => typeof value === 'object' && hasKey(FormKey.ERROR, value) ?
      input$[key].value[FormKey.ERROR] = value[FormKey.ERROR] : input$[key].value = value);

  /** Set input to dirty if not already dirty */
  if (!input$[FormKey.DIRTY].value) {
    input$[FormKey.DIRTY].value = input$.value.value !== (null || undefined || '' || input$[FormKey.ORIGINAL].value);
  }

  input$[FormKey.ERROR].value = input$[FormKey.INVALID].value && input$[FormKey.DIRTY].value;
}

export const setValidator = async (validator, value) => {
  let validation = {};
  const key = Object.keys(validator(value))[0];

  if (validator(value)[key].then) {
    validation[key] = await validator(value)[key];
  } else {
    validation = validator(value);
  }
  return validation;
}

export const formInputSimple = (value) => {
  const input$ = reactive(setSimpleInputObject(value));
  const inputAsRef$ = toRefs(input$);
  watchEffect(() => {
    if (!inputAsRef$[FormKey.DIRTY].value) {
      inputAsRef$[FormKey.DIRTY].value = inputAsRef$.value.value !== (null || undefined || '' || inputAsRef$[FormKey.ORIGINAL].value);
    }
  });
  return input$;
}

export const formInputValidator = (value, validator) => {
  const input$ = reactive({ ...setValidationInputObject(value), ...validator(value) })
  const inputAsRef$ = toRefs(input$)
  watchEffect(async onInvalidate => {
    onInvalidate(() => { /** set for promise invalidation */ });
    const validations = await setValidator(validator, inputAsRef$.value.value);

    setInputValues(inputAsRef$, validations);
  });
  return input$;
}

export const formInputValidatorsArray = (value, validators) => {
  /** get the initial values of provided validators */
  let getInitialValidations;
  validators.forEach(validator => getInitialValidations = { ...getInitialValidations, ...validator(value) });

  const input$ = reactive({ ...setValidationInputObject(value), ...getInitialValidations })
  const inputAsRef$ = toRefs(input$)
  watchEffect(async onInvalidate => {
    onInvalidate(() => { /** set for promise invalidation */ })
    let validations;
    /** need to iterate over an array of validators and check for promises */
    await Promise.all(validators.map(async validator => {
      let validation = await setValidator(validator, inputAsRef$.value.value);

      validations = { ...validations, ...validation };
      return validation;
    }));

    setInputValues(inputAsRef$, validations);
  });
  return input$;
}

/** checks if there is an array of validations or not */
export const formInput = (value, validators) => {
  if (validators) {
    return Array.isArray(validators) ? formInputValidatorsArray(value, validators) : formInputValidator(value, validators);
  } else {
    return formInputSimple(value);
  }
}

export default formInput;
