## I. Sử dụng `Tini Recycle` như thế nào

**1. Cài đặt**
    
```sh
yarn add tini-recycle
Hoặc
npm install --save tini-recycle
```

**2. Basic Code**
```js
import { $page } from "tini-recycle";

const authHook = () => [
    {
        data: { user: null, loading: true },
        async onLoad() {
            this.setData({ loading: true });
            let user = await getCurrentUser();
            if (!user) user = await this.login();
            this.setData({ user, loading: false });
        },
        async login() {
            // Logic To Login
        },
    },
];

$page(
    authHook(),
    {
        data: {
            // others state
        },
        onTap() {
            console.log(this.data.user, this.data.loading)
            // Return user and loading data
        }
    }
);
```
 
**3. Các method**

```ts
import { $page, $component, hooks } from "tini-recycle"
$page(...hooks: Hook[])
$component(...hooks: Hook[])

type Config = TiniPageConfig | TiniComponentConfig;
type Hook = Config | [Hook] | (config: Config) => Hook
```

## II. Các hooks thường dùng

**Cài đặt**
```js
import { hooks } from "tini-recycle"
```

**1. hooks.hookLoadMore**

*Chỉ support cho $page*

```ts
type Option = {
    throttleWait: number, // default 50 - Nhận sự kiện scroll mỗi {throttleWait} giây
    threshold: number, // default 1000 - Nhận sự kiện khi end of scroll trước {threshold}px
    disabled: boolean, // default fale - Stop sự kiện loadmore
    methodName: string, // default "onLoadMore" - Tên method được gọi khi cuộn xuống dưới cùng
}
hooks.hookLoadMore: (option: Option) => any
```

Ví dụ
```js
$page(
    hooks.hookLoadMore({ methodName: 'onLoadMore', throttleWait: 50, threshold: 300 }),
    {
        data: {
            items: [],
        },
        page: 1,
        async onLoadMore() {
            const { items, page } = await api.getItems({ page: this.page });
            this.page = page;
            this.setData({ items: [...this.data.items, ...items] });
        }
    }
)
```

**2. hooks.hookQueryParser**

Hook giúp chuyển giá trị `query` trong `onLoad` từ string sang `Object`
Chi tiết: https://developers.tiki.vn/docs/framework/miniapp-page/life-cycle#onload

```ts
() => any
```
```js
$page(
    hooks.hookQueryParser(),
    {
        onLoad(query) {
            console.log(typeof query); // Object not string
        },
    }
);
```

**3. hooks.hookMapPropsToMethods**

```ts
(mapping: Record<[methodName: string],[propName: string]>) => any
```
Ví dụ
```js
$component(
    hooks.hookMapPropsToMethods(["handleLogin", "onLogin"]),
    {
        onTap() {
            this.handleTap(); // === this.props.onLogin()
        },
    }
);
```
**4. hooks.hookMapPropsToData**

```ts
type Data = Record<string,any>;
type Props = Record<string,any>;
((props: Props, data: Data) => [newData: Data]) => any
```
Ví dụ
```js
$component(
    hooks.hookMapPropsToData(function (props) {
        return { id: props.id.toString() };
    }),
    {
        onTap() {
            console.log(this.data.id);
        },
    }
);
```

## III. Global Hooks
Ở trên các bạn sẽ sử dụng các hook cho từng page. Ví dụ `hooks.hookQueryParser()` gần như page nào cũng sử dụng. Vậy cách nào để apply nó  cho tất cả page
```js
// app.js
$page.addBeforeAll(hooks.hookQueryParser());
```
Ngoài ra `Tini Recycle` còn cung cấp các method global hook khác như
```js
// app.js
$page.addBeforeAll(hook: Hook);
$page.addAfterAll(hook: Hook);
$component.addBeforeAll(hook: Hook);
$component.addAfterAll(hook: Hook);
```