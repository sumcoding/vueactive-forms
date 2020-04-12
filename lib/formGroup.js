import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { hasValue, hasKey } from './utils'

const touch = (group) => () => Object.entries(group).forEach(([key, obj]) => {
  if(hasKey(FormKey.DIRTY, obj)) obj[FormKey.DIRTY] = true;
});

const reset = (group) => () => {
  Object.entries(group).forEach(([key, obj]) => {
    if(hasKey(FormKey.DIRTY, obj)) obj[FormKey.DIRTY] = value;
    if(hasKey(FormKey.VALUE, obj)) obj[FormKey.VALUE] = obj[FormKey.ORIGINAL];
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
    clean: null,
    touch: null,
    reset: null,
  });

  const groupAsRefs$ = toRefs(group$);
  groupAsRefs$.clean.value = clean(group$);
  groupAsRefs$.touch.value = touch(group$);
  groupAsRefs$.reset.value = reset(group$);

  watchEffect(() => {
    groupAsRefs$[FormKey.INVALID].value = Object.entries(group).map(
      ([key, obj]) => obj[FormKey.INVALID]
    ).includes(true);

    groupAsRefs$[FormKey.DIRTY].value = Object.entries(group).map(
      ([key, obj]) => obj[FormKey.DIRTY]
    ).includes(true);
  });

  return group$;
}

export default formGroup;
