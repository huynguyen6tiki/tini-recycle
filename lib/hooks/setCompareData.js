import deepcompare from '../utils/deepcompare';

const hookSetCompareData = () => (options) => {
  const methods = {
    setCompareData(data, callback) {
      const newData = {};
      let allowSet = false;
      for (const key in data) {
        if (!deepcompare(data[key], this.data[key])) {
          newData[key] = data[key];
          allowSet = true;
        }
      }
      if (allowSet) {
        this.setData(newData, callback);
      } else {
        callback && callback();
      }
    },
  };
  if (options.type === 'page') {
    return methods;
  }
  if (options.type === 'component') {
    return { methods };
  }
  return { ...methods, methods };
};

export default hookSetCompareData;
