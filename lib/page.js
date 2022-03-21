import compose from './compose';

/**
 * @typedef {Record<string, any>} Data
 * @typedef {() => any} OnLoad
 * @typedef {() => any} OnShow
 * @typedef {(prevProps: props, prevData: data) => any} OnHide
 * @typedef {() => any} OnReady
 * @typedef {() => any} OnUnload
 * @typedef {() => any} OnPullDownRefresh
 * @typedef {() => any} OnShareAppMessage
 * @typedef {(event: {scrollHeight: number, scrollTop: number}) => any} OnPageScroll
 *
 * @typedef {Object}  Option
 * @property {"page" | "component"} type [Auto inject]
 * @property {Data} data
 * @property {OnLoad} onLoad - được gọi khi Page được load
 * @property {OnShow} onShow - được gọi khi Page được show hoặc mở lại từ background
 * @property {OnHide} onHide - được gọi sau Page bị hide hoặc enter background
 * @property {OnReady} onReady - được gọi sau khi page finish render lần đầu tiên
 * @property {OnUnload} onUnload - được gọi khi page bị destroy
 * @property {OnPullDownRefresh} onPullDownRefresh - được gọi khi user pull to refresh hoặc gọi my.startPullDownRefresh
 * @property {OnShareAppMessage} onShareAppMessage - được gọi khi user thực hiện tác vụ "Chia sẻ" trong option menu
 * @property {OnPageScroll} onPageScroll - được gọi khi user scroll page
 *
 * @property {(data: Data) => any} setData - [Auto inject]
 *
 * @param {(Option | ((option: Option) => Option))[]} options
 */
const $page = (...options) => {
  let option = { type: 'page', data: {}, props: {} };

  [...beforeAll, ...options, ...afterAll].reverse().forEach((_option) => {
    option = compose(option, _option, propNestedNames);
  });

  Page(option);
};

const propNestedNames = [['data', 'object']];

const beforeAll = [];
const afterAll = [];

$page.addBeforeAll = (...options) => {
  beforeAll.push(...options);
};

$page.addAfterAll = (...options) => {
  afterAll.push(...options);
};

export default $page;
