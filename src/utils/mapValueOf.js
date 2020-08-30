export const mapValueOf = (object, keyToMap) => {
  const result = [];
  function recursive(o, k) {
    if(!o) return;
    Object.entries(o).forEach(
      ([key, value]) => {
        if (typeof value === 'object') {
          recursive(value, k);
        } else if (key === k) {
          result.push(value);
        }
      });
  }
  recursive(object, keyToMap);
  return result;
}