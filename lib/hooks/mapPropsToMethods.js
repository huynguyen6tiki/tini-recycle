/**
 * @param {Record<methodName: string, propName: string>} mapping
 */
const mapPropsToMethods = (mapping) => {
  const methods = {};
  Object.keys(mapping).forEach((methodName) => {
    const propName = mapping[methodName];
    methods[methodName] = function (...args) {
      return this.props[propName] && this.props[propName](...args);
    };
  });
  return { methods };
};

export default mapPropsToMethods;
