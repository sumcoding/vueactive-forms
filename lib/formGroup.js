import { reactive, toRefs, watchEffect } from 'vue';
import { FormKey } from './FormKey';
import { clean } from './utils/index'

export const formGroup = (group) => {
  const group$ = reactive({
    ...group,
    [FormKey.INVALID]: null,
    [FormKey.DIRTY]: null,
    clean: null
  });

  const groupAsRefs$ = toRefs(group$);
  groupAsRefs$.clean.value = clean(group$);

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