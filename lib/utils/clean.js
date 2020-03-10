import { hasValue, hasKey } from './index';
import { FormKey } from '../FormKey';

export const clean = (toClean) => {
  return () => {
    let newobj;
    Object.entries(toClean).map(
      ([key, obj]) => newobj = !hasValue(key, FormKey) ? { ...newobj, [key]: hasKey('value', obj) ? obj.value : obj } : { ...newobj });
    return newobj;
  }
}