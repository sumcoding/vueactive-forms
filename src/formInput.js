import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { hasKey } from './utils';

const simple = (value) => ({[FormKey.ORIGINAL]: value, value, [FormKey.DIRTY]: null})
const setInputObject = (value) => ({ [FormKey.INVALID]: null, [FormKey.ERROR]: null, ...simple(value) });

const setInput = (input$, validations) => {
  /** check if any validation is returning true */
  input$[FormKey.INVALID].value = Object.entries(validations).map(
    ([key, value]) => typeof value === 'object' && hasKey(FormKey.ERROR, value) ? value[FormKey.ERROR] : value
  ).includes(true);

  /** Set validation attributes on change */
  Object.entries(validations)
    .map(([key, value]) => typeof value === 'object' && hasKey(FormKey.ERROR, value) ? 
      input$[key].value[FormKey.ERROR] = value[FormKey.ERROR] : input$[key].value = value);

  /** Set input to dirty if not already dirty */
  if(!input$[FormKey.DIRTY].value) {
    input$[FormKey.DIRTY].value = input$.value.value !== (null || undefined || '' || input$[FormKey.ORIGINAL].value);
  }

  input$[FormKey.ERROR].value = input$[FormKey.INVALID].value && input$[FormKey.DIRTY].value;
}

const formInputSimple = (value) => {
  const input$ = reactive(simple(value));
  const inputAsRef$ = toRefs(input$)
  watchEffect(() => {
    if(!inputAsRef$[FormKey.DIRTY].value) {
      inputAsRef$[FormKey.DIRTY].value = inputAsRef$.value.value !== (null || undefined || '' || inputAsRef$[FormKey.ORIGINAL].value);
    }
  });
  return input$;
}

const formInputValidator = (validator, value) => {
  const input$ = reactive({ ...setInputObject(value), ...validator(value) })
  const inputAsRef$ = toRefs(input$)
  watchEffect(() => {
    const validations = { ...validator(inputAsRef$.value.value) };

    setInput(inputAsRef$, validations);
  });
  return input$;
}

const formInputValidatorsArray = (validators, value) => {
  /** get the initial values of provided validators */
  let getInitialValidations;
  validators.forEach(validator => getInitialValidations = { ...getInitialValidations, ...validator(value) });

  const input$ = reactive({ ...setInputObject(value), ...getInitialValidations })
  const inputAsRef$ = toRefs(input$)
  watchEffect(() => {
    // need to iterate over an array of validators
    let validations;
    validators.forEach(validator => validations = { ...validations, ...validator(inputAsRef$.value.value) });

    setInput(inputAsRef$, validations);
  });
  return input$;
}

/** checks if there is an array of validations or not */
export const formInput = (value, validators) => {
  if (validators) {
    return Array.isArray(validators) ? formInputValidatorsArray(validators, value) : formInputValidator(validators, value);
  } else {
    return formInputSimple(value);
  }
}

export default formInput;
