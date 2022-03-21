const initData = () => {
  return ({ type }) => ({
    [type === 'page' ? 'onLoad' : 'onInit']: function (...args) {
      this.setData(this.data);
      return args;
    },
  });
};

export default initData;
