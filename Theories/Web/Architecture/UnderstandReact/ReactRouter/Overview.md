# Overview


<!-- TOC -->

- [Overview](#overview)
    - [Navigation](#navigation)
        - [声明式导航](#声明式导航)
        - [编程式导航](#编程式导航)
    - [URL Parameters](#url-parameters)
    - [Nested Routes](#nested-routes)
        - [基本用法](#基本用法)
        - [Index Routes](#index-routes)
    - [Relative Links](#relative-links)
    - ["Not Found" Routes](#not-found-routes)
    - [Multiple Sets of Routes](#multiple-sets-of-routes)
    - [Descendant `<Routes>`](#descendant-routes)

<!-- /TOC -->


## Navigation
### 声明式导航
```js
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Home</h1>
            <nav>
                <Link to="/">Home</Link> | <Link to="about">About</Link>
            </nav>
        </div>
    );
}
```

### 编程式导航
```js
import { useNavigate } from "react-router-dom";

function Invoices() {
    let navigate = useNavigate();
    return (
        <div>
            <NewInvoiceForm
                onSubmit={async (event) => {
                    let newInvoice = await createInvoice(event.target);
                    navigate(`/invoices/${newInvoice.id}`);
                }}
            />
        </div>
    );
}
```


## URL Parameters
```js
import { Routes, Route, useParams } from "react-router-dom";

function App() {
    return (
        <Routes>
            {/* 传参 */}
            <Route path="invoices/:invoiceId" element={<Invoice />} />
        </Routes>
    );
}

function Invoice() {
    {/* 使用参数 */}
    let params = useParams();
    return <h1>Invoice {params.invoiceId}</h1>;
}
```


## Nested Routes
### 基本用法
1. 直接在 Route 中嵌套 Route，the nested url segments map to nested component trees
    ```js
    function App() {
        return (
            <Routes>
                <Route path="invoices" element={<Invoices />}>
                    {/* 两个嵌套路由 */}
                    <Route path=":invoiceId" element={<Invoice />} />
                    <Route path="sent" element={<SentInvoices />} />
                </Route>
            </Routes>
        );
    }
    ```
2. This route config defined three route paths:
    * `"/invoices"`
    * `"/invoices/sent"`
    * `"/invoices/:invoiceId"`
3. When the URL is `"/invoices/sent"` the component tree will be:
    ```js
    <App>
        <Invoices>
            <SentInvoices />
        </Invoices>
    </App>
    ```
4. When the URL is `"/invoices/123"`, the component tree will:
    ```js
    <App>
        <Invoices>
            <Invoice />
        </Invoices>
    </App>
    ```
5. The parent route (`<Invoices>`) is responsible for making sure the matching child route is rendered with `<Outlet>`. Here's the full example
    ```js
    import { Routes, Route, Outlet } from "react-router-dom";

    function App() {
        return (
            <Routes>
                <Route path="invoices" element={<Invoices />}>
                    <Route path=":invoiceId" element={<Invoice />} />
                    <Route path="sent" element={<SentInvoices />} />
                </Route>
            </Routes>
        );
    }

    function Invoices() {
        return (
            <div>
                <h1>Invoices</h1>
                <Outlet />
            </div>
        );
    }

    function Invoice() {
        let { invoiceId } = useParams();
        return <h1>Invoice {invoiceId}</h1>;
    }

    function SentInvoices() {
        return <h1>Sent Invoices</h1>;
    }
    ```

### Index Routes
1. Index routes can be thought of as "default child routes". When a parent route has multiple children, but the URL is just at the parent's path, you probably want to render something into the outlet.
2. 下面的例子中，如果 URL 是 `/`，则会默认渲染 `<Activity />`
    ```js
    function App() {
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Activity />} />
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="activity" element={<Activity />} />
                </Route>
            </Routes>
        );
    }
    ```


## Relative Links
1. Relative `<Link to>` values (that do not begin with a `/`) are relative to the path of the route that rendered them. 
2. The two links below will link to `/dashboard/invoices` and `/dashboard/team` because they're rendered inside of `<Dashboard>`
    ```js
    function Home() {
        return <h1>Home</h1>;
    }

    function Dashboard() {
        return (
            <div>
                <h1>Dashboard</h1>
                <nav>
                    <Link to="invoices">Invoices</Link> <Link to="team">Team</Link>
                </nav>
                <hr />
                <Outlet />
            </div>
        );
    }

    function Invoices() {
        return <h1>Invoices</h1>;
    }

    function Team() {
        return <h1>Team</h1>;
    }

    function App() {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="dashboard" element={<Dashboard />}>
                    <Route path="invoices" element={<Invoices />} />
                    <Route path="team" element={<Team />} />
                </Route>
            </Routes>
        );
    }
    ```


## "Not Found" Routes
When no other route matches the URL, you can render a "not found" route using `path="*"`. This route will match any URL, but will have the weakest precedence so the router will only pick it if no other routes match
```js
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
```


## Multiple Sets of Routes
1. Although you should only ever have a single `<Router>` in an app, you may have as many `<Routes>` as you need, wherever you need them. 
2. Each `<Routes>` element operates independently of the others and picks a child route to render
    ```js
    function Sidebar(props) {
        return (
            <section>
                <h2>Sidebar</h2>
                {props.children}
            </section>
        );
    }
    function MainNav(props) {
        return (
            <section>
                <h3>MainNav</h3>
            </section>
        );
    }
    function DashboardNav(props) {
        return (
            <section>
                <h3>DashboardNav</h3>
            </section>
        );
    }

    function MainContent(props) {
        return (
            <section>
                <h2>MainContent</h2>
                {props.children}
            </section>
        );
    }
    function Home(props) {
        return (
            <section>
                <h3>Home</h3>
                {props.children}
                <Outlet />
            </section>
        );
    }
    function About(props) {
        return (
            <section>
                <h4>About</h4>
            </section>
        );
    }
    function Support(props) {
        return (
            <section>
                <h4>Support</h4>
            </section>
        );
    }
    function Dashboard(props) {
        return (
            <section>
                <h3>Dashboard</h3>
                {props.children}
                <Outlet />
            </section>
        );
    }
    function Invoices(props) {
        return (
            <section>
                <h4>Invoices</h4>
            </section>
        );
    }
    function Team(props) {
        return (
            <section>
                <h4>Team</h4>
            </section>
        );
    }
    function NotFound(props) {
        return (
            <section>
                <h3>NotFound</h3>
            </section>
        );
    }

    function App() {
        return (
            <div>
                <Sidebar>
                    <Routes>
                        <Route path="/" element={<MainNav />} />
                        <Route path="dashboard" element={<DashboardNav />} />
                    </Routes>
                </Sidebar>

                <MainContent>
                    <Routes>
                        <Route path="/" element={<Home />}>
                            <Route path="about" element={<About />} />
                            <Route path="support" element={<Support />} />
                        </Route>
                        <Route path="dashboard" element={<Dashboard />}>
                            <Route path="invoices" element={<Invoices />} />
                            <Route path="team" element={<Team />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </MainContent>
            </div>
        );
    }
    ```



## Descendant `<Routes>`
1/ You can render a `<Routes>` element anywhere you need one, including deep within the component tree of another `<Routes>`. These will work just the same as any other `<Routes>`, except they will automatically build on the path of the route that rendered them. 
2. If you do this, make sure to put a `*` at the end of the parent route's path. Otherwise, the parent route won't match the URL when it is longer than the parent route's path, and your descendant `<Routes>` won't ever show up.
    ```js
    function DashboardGraphs () {
        return (
            <div>
                DashboardGraphs
            </div>
        );
    }
    function InvoiceList () {
        return (
            <div>
                InvoiceList
            </div>
        );
    }
    function Home () {
        return (
            <div>
                Home
            </div>
        );
    }

    function Dashboard() {
        return (
            <div>
                <p>Look, more routes!</p>
                <Routes>
                    <Route path="/" element={<DashboardGraphs />} />
                    <Route path="invoices" element={<InvoiceList />} />
                </Routes>
            </div>
        );
    }

    function App() {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="dashboard/*" element={<Dashboard />} />
            </Routes>
        );
    }
    ```
3. 如果不加 `*`，URL 为 `/dashboard/invoices` 时匹配不到 `<InvoiceList />`。不加 `*` 后代 `<Routes>` 唯一能匹配到情况就是 URL `/dashboard` 是匹配到后代 `<Routes>` 中 `path` 为 `/` 的路由。