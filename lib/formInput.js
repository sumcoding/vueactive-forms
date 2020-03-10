import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';

const formInputValidator = (validator, value) => {
  const input$ = reactive({ [FormKey.INVALID]: null, value, [FormKey.DIRTY]: null, ...validator(value) })
  const inputAsRef$ = toRefs(input$)
  watchEffect(() => {
    const validations = { ...validator(inputAsRef$.value.value) };

    inputAsRef$[FormKey.INVALID].value = Object.entries(validations).map(
      ([key, obj]) => obj
    ).includes(true);

    Object.entries(validations).map(([key, obj]) => inputAsRef$[key].value = obj);
    inputAsRef$[FormKey.DIRTY].value = inputAsRef$.value.value !== (null || undefined || '');
  });
  return input$;
}

const formInputValidatorsArray = (validators, value) => {
  // get the intial values of provided validators
  console.log(validators)
  let getInitialValidations;
  validators.forEach(validator => getInitialValidations = { ...getInitialValidations, ...validator(value) });

  const input$ = reactive({ [FormKey.INVALID]: null, value, [FormKey.DIRTY]: null, ...getInitialValidations })
  const inputAsRef$ = toRefs(input$)
  watchEffect(() => {
    // need to iterate over an array of validators
    let validations;
    validators.forEach(validator => validations = { ...validations, ...validator(inputAsRef$.value.value) });

    inputAsRef$[FormKey.INVALID].value = Object.entries(validations).map(
      ([key, obj]) => obj
    ).includes(true);

    Object.entries(validations).map(([key, obj]) => inputAsRef$[key].value = obj);
    inputAsRef$[FormKey.DIRTY].value = inputAsRef$.value.value !== (null || undefined || '');
  });
  return input$;
}

export const formInput = (validators, value = '') => Array.isArray(validators) ? formInputValidatorsArray(validators, value) : formInputValidator(validators, value);
