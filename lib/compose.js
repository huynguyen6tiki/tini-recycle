const compose = (option, newOption, propNestedNames) => {
  if (typeof newOption === 'function') {
    return compose(option, newOption(option), propNestedNames);
  }
  if (Array.isArray(newOption)) {
    newOption.reverse().forEach((_newOption) => {
      option = compose(option, _newOption, propNestedNames);
    });
    return option;
  }
  for (const key in newOption) {
    if (key === 'type') continue;
    // Nếu config là function cần bổ sung logic
    if (typeof option[key] === 'function' && typeof newOption[key] === 'function') {
      const onEvent = option[key];
      if (!isAsyncFunction(newOption[key]) && !isAsyncFunction(onEvent)) {
        option[key] = function (...args) {
          let result = newOption[key].apply(this, args);
          // const newArgs = Array.isArray(result) ? result : args;
          const newArgs = Array.isArray(result) ? result : [result];
          return onEvent && onEvent.apply(this, newArgs);
        };
      } else {
        option[key] = async function (...args) {
          let result = await newOption[key].apply(this, args);
          // const newArgs = Array.isArray(result) ? result : args;
          const newArgs = Array.isArray(result) ? result : [result];
          return onEvent && (await onEvent.apply(this, newArgs));
        };
      }
    }
    // Nếu config là object cẩn bổ sung props
    else if (propNestedNames.find(([item]) => item === key)) {
      const [prop, type] = propNestedNames.find(([item]) => item === key);
      if (type === 'object') option[key] = { ...option[key], ...newOption[key] };
      else if (type === 'array') option[key] = [...(option[key] || []), ...newOption[key]];
    } else {
      option[key] = newOption[key];
    }
  }
  return option;
};

const AsyncFunction = (async () => {}).constructor;
const isAsyncFunction = (func) => {
  return func instanceof AsyncFunction;
};

export default compose;
