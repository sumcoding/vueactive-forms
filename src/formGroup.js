import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { hasKey, mapValueOf } from './utils'
import { formInput } from './formInput';

function recursive(obj, callback) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object' && !hasKey(FormKey, value)) {
      recursive(value, callback);
    } else { callback(value, key, obj); }
  });
}

const touch = (toTouch) => () => recursive(toTouch, value => { if (hasKey(FormKey.DIRTY, value)) value[FormKey.DIRTY] = true });

const reset = (toReset) => () => recursive(toReset, value => {
  if (hasKey(FormKey.DIRTY, value)) value[FormKey.DIRTY] = false;
  if (hasKey('value', value)) value.value = value[FormKey.ORIGINAL];
});

const clean = (toClean) => {
  return () => {
    // make a deep copy of the object
    const newobj = JSON.parse(JSON.stringify(toClean));
    // remove top level FormKey's
    delete newobj[FormKey.ERROR];
    delete newobj[FormKey.INVALID];
    delete newobj[FormKey.DIRTY];
    // iterate over the new obj 
    recursive(newobj, (value, key, obj) => { obj[key] = hasKey('value', value) ? value.value : value; });
    return newobj;
  };
}

const addSimpleInputToPlainValues = (toAdd) => {
  recursive(toAdd, (value, key, obj) => { if(typeof obj[key] !== 'object') obj[key] = formInput(value); });
}

export const formGroup = (group) => {
  addSimpleInputToPlainValues(group);
  const group$ = reactive({
    ...group,
    [FormKey.INVALID]: null,
    [FormKey.DIRTY]: null,
    [FormKey.CLEAN]: null,
    [FormKey.TOUCH]: null,
    [FormKey.RESET]: null,
    [FormKey.ERROR]: null,
  });

  const groupAsRefs$ = toRefs(group$);
  groupAsRefs$[FormKey.CLEAN].value = clean(group$);
  groupAsRefs$[FormKey.TOUCH].value = touch(group$);
  groupAsRefs$[FormKey.RESET].value = reset(group$);

  watchEffect(() => {
    /** checks all inputs for any that are Invalid or dirty */
    groupAsRefs$[FormKey.INVALID].value = mapValueOf(group, FormKey.INVALID).includes(true);
    groupAsRefs$[FormKey.DIRTY].value = mapValueOf(group, FormKey.DIRTY).includes(true);
    groupAsRefs$[FormKey.ERROR].value = groupAsRefs$[FormKey.DIRTY].value && groupAsRefs$[FormKey.INVALID].value;
  });

  return group$;
}

export default formGroup;
