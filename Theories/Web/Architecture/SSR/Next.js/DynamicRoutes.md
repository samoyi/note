# Dynamic Routes


<!-- TOC -->

- [Dynamic Routes](#dynamic-routes)
    - [Page Path Depends on External Data](#page-path-depends-on-external-data)
    - [生成 paths 对象](#生成-paths-对象)
    - [`getStaticPaths`](#getstaticpaths)
        - [`fallback` 参数](#fallback-参数)
    - [带参数的 `getStaticProps`](#带参数的-getstaticprops)
    - [Catch-all Routes](#catch-all-routes)
    - [404 Pages](#404-pages)

<!-- /TOC -->


## Page Path Depends on External Data
1. 根据若干个外部资源自动生成对应的路由，来显示对应的外部资源对应的页面。一个例子就是根据一组文章自动生成一组路由（可以使用文章ID），每个路由显示对应的文章。
2. 这里还是使用静态生成的预渲染方案来生成对应的页面。
3. 下面的例子中，生成的动态路由为 `/posts/<id>`，，`id` 是文章 ID。
4. 用来生成的文章文件是的脚本是 `/pages/posts/[id].js`。这里这里的文件名带 `[]`，在 `/pages/` 目录下带 `[]` 的文件是用来实现动态路由的，它会在所在的目录中生成对应路由的具体 page 文件。
5. 这个例子中的两个外部资源是 ` ssg-ssr.md` 和 `pre-rendering.md`，我们使用它们无后缀的文件名作为 ID，所以动态生成的两个路由是 `/posts/ssg-ssr` 和 `/posts/pre-rendering`，生成的两个 page 文件是 `/pages/posts/ssg-ssr.html` 和 `/pages/posts/pre-rendering.html`。


## 生成 paths 对象
1. 读取 markdown 资源，获取文件名，生成 paths 对象
    ```js
    export function getAllPostIds() {
        const fileNames = fs.readdirSync(postsDirectory);

        return fileNames.map((fileName) => {
            return {
                params: {
                    id: fileName.replace(/\.md$/, ''),
                },
            };
        });
    }
    ```
2. 注意这里 paths 的类型：paths 是一个数组，其中具体每个 path 是一个包含 `params` 对象的对象，而每个 `params` 对象有需要有个 `id` 属性来制定路由中的 `id`。
3. 就本例来说，生成 paths 对象为
    ```js
    [
      {
        params: {
          id: 'ssg-ssr'
        }
      },
      {
        params: {
          id: 'pre-rendering'
        }
      }
    ]
    ```


## `getStaticPaths`
1. 在 `[id].js` 文件中，需要使用 paths 对象来创建路由关系，这个工作必须要通过定义一个名为 `getStaticPaths` 的函数来完成
    ```js
    export async function getStaticPaths() {
        const paths = getAllPostIds();
        return {
            paths,
            fallback: false,
        };
    }
    ```
2. 通过在 `[id].js` 中输出 `getStaticPaths` 函数，Next.js 就会生成路径和页面的对应关系。

### `fallback` 参数
* If `fallback` is false, then any paths not returned by `getStaticPaths` will result in a 404 page.
* If `fallback` is true, then the behavior of `getStaticProps` changes:
    * The paths returned from `getStaticPaths` will be rendered to HTML at build time. 不懂，难道 false 时不是？
    * The paths that have not been generated at build time will not result in a 404 page. Instead, Next.js will serve a “fallback” version of the page on the first request to such a path. 不懂第二句什么意思，实测访问时就是直接报错。
    * In the background, Next.js will statically generate the requested path. Subsequent requests to the same path will serve the generated page, just like other pages pre-rendered at build time. 不懂，这不是静态生成本来就该做的吗？
    * If `fallback` is `blocking`, then new paths will be server-side rendered with `getStaticProps`, and cached for future requests so it only happens once per path. 不懂
    

## 带参数的 `getStaticProps`
1. 因为我们在生成静态页面时需要用到 markdown 文件的内容，所以还需要 `getStaticProps` 函数。
2. 但因为现在不只是生成一个页面，而是通过 `[id].js` 生成多个页面，所以 `getStaticProps` 函数也要参数接收来分别生成不同的页面。
3. 接收的参数就是每个页面对应的 path 对象
    ```js
    export async function getStaticProps({ params }) {
        const postData = getPostData(params.id);
        return {
            props: {
                postData,
            },
        };
    }
    ```
4. 通过每个页面的 path 对象，找到其中的 id，加载对应的 markdown 数据，并返回带 `props` 属性的对象给具体的组件函数，供其渲染
    ```js
    export default function Post({ postData }) {
        return (
            <Layout>
                {postData.title}
                <br />
                {postData.id}
                <br />
                {postData.date}
            </Layout>
        );
    }
    ```


## Catch-all Routes
1. Dynamic routes can be extended to catch all paths by adding three dots (`...`) inside the brackets. 
2. For example: `pages/posts/[...id].js` matches `/posts/a`, but also `/posts/a/b`, `/posts/a/b/c` and so on.
3. If you do this, in `getStaticPaths`, you must return an array as the value of the `id` key like so:
    ```js
    return [
        {
            params: {
                // Statically Generates /posts/a/b/c
                id: ['a', 'b', 'c'],
            },
        },
        //...
    ];
    ```


## 404 Pages
To create a custom 404 page, create `pages/404.js`. This file is statically generated at build time.
```js
// pages/404.js
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}
```