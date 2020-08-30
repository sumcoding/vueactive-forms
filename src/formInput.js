import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { hasKey } from './utils';

const simple = (value) => ({ [FormKey.ORIGINAL]: value, value, [FormKey.DIRTY]: null })
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
  if (!input$[FormKey.DIRTY].value) {
    input$[FormKey.DIRTY].value = input$.value.value !== (null || undefined || '' || input$[FormKey.ORIGINAL].value);
  }

  input$[FormKey.ERROR].value = input$[FormKey.INVALID].value && input$[FormKey.DIRTY].value;
}

const formInputSimple = (value) => {
  const input$ = reactive(simple(value));
  const inputAsRef$ = toRefs(input$);
  watchEffect(() => {
    if (!inputAsRef$[FormKey.DIRTY].value) {
      inputAsRef$[FormKey.DIRTY].value = inputAsRef$.value.value !== (null || undefined || '' || inputAsRef$[FormKey.ORIGINAL].value);
    }
  });
  return input$;
}

const setValidator = async (validator, value) => {
  let validation = {};
  const key = Object.keys(validator(value))[0];

  if (validator(value)[key].then) {
    validation[key] = await validator(value)[key];
  } else {
    validation = validator(value);
  }
  return validation;
}

const formInputValidator = (validator, value) => {
  const input$ = reactive({ ...setInputObject(value), ...validator(value) })
  const inputAsRef$ = toRefs(input$)
  watchEffect(async onInvalidate => {
    onInvalidate(() => { console.log('invalidate') });
    const validations = await setValidator(validator, inputAsRef$.value.value);

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
  watchEffect(async onInvalidate => {
    onInvalidate(() => { console.log('invalidate') })
    let validations;
    /** need to iterate over an array of validators and check for promises */
    await Promise.all(validators.map(async validator => {
      let validation = await setValidator(validator, inputAsRef$.value.value);

      validations = { ...validations, ...validation };
      return validation;
    }));

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
