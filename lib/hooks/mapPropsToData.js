/**
 * @param {(props: Record<string, any>, data: Record<string, any>) => Record<string, any>} getData
 * @returns
 */
const mapPropsToData = (getData) => ({
  onInit(...args) {
    const data = getData(this.props, this.data);
    this.setData(data);
    return args;
  },
  deriveDataFromProps(props) {
    const data = getData(props, this.data);
    this.setCompareData(data);
    return [props];
  },
});

export default mapPropsToData;
