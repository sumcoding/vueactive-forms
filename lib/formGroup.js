import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { hasValue, hasKey, mapValueOf } from './utils'

const touch = (toTouch) => () => Object.entries(toTouch).forEach(([key, obj]) => {
  if(hasKey(FormKey.DIRTY, obj)) obj[FormKey.DIRTY] = true;
});

const reset = (toReset) => () => {
  Object.entries(toReset).forEach(([key, obj]) => {
    if(hasKey(FormKey.DIRTY, obj)) obj[FormKey.DIRTY] = false;
    if(hasKey('value', obj)) obj.value = obj[FormKey.ORIGINAL];
  });
}

const clean = (toClean) => {
  return () => {
    let newobj;
    Object.entries(toClean).map(
      ([key, obj]) => newobj = !hasValue(key, FormKey) ? { ...newobj, [key]: hasKey('value', obj) ? obj.value : obj } : { ...newobj });
    return newobj;
  };
}

export const formGroup = (group) => {
  const group$ = reactive({
    ...group,
    [FormKey.INVALID]: null,
    [FormKey.DIRTY]: null,
    [FormKey.CLEAN]: null,
    [FormKey.TOUCH]: null,
    [FormKey.RESET]: null,
  });

  const groupAsRefs$ = toRefs(group$);
  groupAsRefs$[FormKey.CLEAN].value = clean(group$);
  groupAsRefs$[FormKey.TOUCH].value = touch(group$);
  groupAsRefs$[FormKey.RESET].value = reset(group$);


  watchEffect(() => {
    groupAsRefs$[FormKey.INVALID].value = mapValueOf(group, FormKey.INVALID).includes(true);
    groupAsRefs$[FormKey.DIRTY].value = mapValueOf(group, FormKey.DIRTY).includes(true);
  });

  return group$;
}

export default formGroup;
