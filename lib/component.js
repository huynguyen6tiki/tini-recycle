import compose from './compose';

/**
 * @typedef {Record<string, any>} Data
 * @typedef {Record<string, any>} Props
 * @typedef {() => any} OnInit
 * @typedef {() => any} DidMount
 * @typedef {(prevProps: props, prevData: data) => any} DidUpdate
 * @typedef {() => any} DidUnmount
 * @typedef {(nextProps: any) => any} DeriveDataFromProps
 * @typedef {Object} Lifecycle
 * @property {OnInit} onInit
 * @property {DidMount} didMount
 * @property {DidUpdate} didUpdate
 * @property {DidUnmount} didUnmount
 * @property {DeriveDataFromProps} deriveDataFromProps
 * @typedef {Record<string, () => any>} Methods
 * @typedef {[Lifecycle, Data, Props, Methods]} Mixins
 *
 * @typedef {Object}  Option
 * @property {Data} data - Các trạng thái nội tại của Component
 * @property {Props} props - Các giá trị mặc định cho external data
 * @property {OnInit} onInit - Hàm này được gọi khi component được khởi tạo
 * @property {DidMount} didMount - Hàm được gọi sau khi Component được mount
 * @property {DidUpdate} didUpdate - Hàm được gọi sau khi Component được update
 * @property {DidUnmount} didUnmount - Hàm được gọi sau khi Component được unmount
 * @property {DeriveDataFromProps} deriveDataFromProps - Hàm được gọi khi comment được khởi tạo, và trước khi nó được update
 * @property {Methods} methods - Các hàm xử lý sự kiện hoặc bất kỳ method nào được thêm mới
 * @property {Function} ref - Xác định giá trị được trả về khi Component được tham chiếu bởi ref
 *
 * @property {(data: Data) => any} setData - [Auto inject]
 *
 * @param {(Option | ((option: Option) => Option))[]} options
 *
 */
const $component = (...options) => {
  let option = { type: 'component', methods: { type: 'component' }, data: {}, props: {} };

  [...beforeAll, ...options, ...afterAll].reverse().forEach((_option) => {
    option = compose(option, _option, propNestedNames);
  });

  delete option.type;

  Component(option);
};

const propNestedNames = [
  ['data', 'object'],
  ['props', 'object'],
  ['methods', 'object'],
];

const beforeAll = [];
const afterAll = [];

$component.addBeforeAll = (...options) => {
  beforeAll.push(...options);
};

$component.addAfterAll = (...options) => {
  afterAll.push(...options);
};

export default $component;
