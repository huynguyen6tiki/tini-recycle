let isLoadingMore = false;

/**
 * @param {Object} option
 * @param {number} [option.throttleWait=50] - Nhận sự kiện scroll mỗi {throttleWait} giây
 * @param {number} [option.threshold=1000] - Nhận sự kiện khi end of scroll trước {threshold}px
 * @param {boolean} [option.disabled=false] - Stop sự kiện loadmore
 * @param {boolean} [option.methodName="onLoadMore"] - Trigger function
 */
const hookLoadmore = (option) => {
  const {
    throttleWait = 50,
    threshold = 1000,
    disabled = false,
    methodName = 'onLoadMore',
    methodDisable = 'disableLoadMore',
  } = option || {};

  return {
    __loadmore: {
      throttleWait,
      threshold,
      disabled,
    },
    onLoad(...args) {
      getWindowHeight();
      return args;
    },
    [methodDisable](disabled) {
      this.__loadmore.disabled = disabled;
    },
    onPageScroll(event) {
      if (!this.__loadmore.disabled && this[methodName]) {
        loadMoreThrottle(this[methodName].bind(this), this.__loadmore, event);
      }
      return [event];
    },
  };
};

let _getWindowHeight = null;
const getWindowHeight = async () => {
  if (!_getWindowHeight) {
    _getWindowHeight = new Promise((resolve) => {
      my.getSystemInfo({
        success: (systemInfo) => {
          resolve(systemInfo.windowHeight);
        },
        fail: () => {
          // Default IPhone 6,7,8 plus
          resolve(667);
        },
      });
    });
  }
  return await _getWindowHeight;
};

let wait = false;
const loadMoreThrottle = async function (onLoadMore, option, event) {
  if (!wait) {
    wait = true;
    setTimeout(() => {
      wait = false;
    }, option.throttleWait);

    if (isLoadingMore) return;

    const windowHeight = await getWindowHeight();
    const { scrollHeight, scrollTop } = event;

    if (windowHeight + scrollTop >= scrollHeight - option.threshold) {
      isLoadingMore = true;
      try {
        await onLoadMore();
      } finally {
        isLoadingMore = false;
      }
    }
  }
};

export default hookLoadmore;
