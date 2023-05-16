# Pre-rendering


<!-- TOC -->

- [Pre-rendering](#pre-rendering)
    - [Summary](#summary)
    - [Two Forms of Pre-rendering](#two-forms-of-pre-rendering)
    - [Static Generation with Data](#static-generation-with-data)
    - [Server-side Rendering](#server-side-rendering)
    - [SWR](#swr)

<!-- /TOC -->


## Summary
1. By default, Next.js pre-renders every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. 
2. Pre-rendering can result in better performance and SEO.
3. Each generated HTML is associated with minimal JavaScript code necessary for that page. When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive. This process is called **hydration**.
4. 所以如果浏览器禁用了 JavaScript，那么也是可以看到初始渲染后的页面的，只不过之后的交互就没法进行了。


## Two Forms of Pre-rendering
1. Next.js 支持两种预渲染：Static Generation 和 Server-side Rendering。两者的区别如下
    * SG 是在构建（build）时预渲染 HTML，然后在每次请求时使用之前生成的同样的 HTML。只渲染一次，之后重复使用相同的文档。
    * SSR 是在每次请求时才预渲染 HTML。每次请求都重渲染，所以可以根据请求的不同渲染不同的文档。
2. 注意，在开发模式下，SG 也是每次请求都重新渲染，主要是为了方便开发。
3. Next.js 允许你在同一个应用中对每个页面采取不同的预渲染方法。如果某个页面的内容不需要根据不同请求变化，且不会频繁变动，那就应该使用 SG，因为它可以更快的响应且可保存在 CDN。


## Static Generation with Data
1. SG 可以是纯静态的，也就是说它不需要额外获得任何数据就生成完整的页面。但也可能在生成静态页面时需要获取一些数据，这时就需要用到 `getStaticProps` 函数来获取数据并提供给页面组件。
2. 在一个需要获取数据的页面组件中，处理 export 组件本身，也要 export 这个 `getStaticProps` 函数，这样在生成这个静态页面时，`getStaticProps` 会被调用来获取数据，然后传递给页面组件进行渲染。示例如下
    ```js
    export default function Home(props) { ... }

    export async function getStaticProps() {
        // Get external data from the file system, API, DB, etc.
        const data = ...

        // The value of the `props` key will be
        //  passed to the `Home` component
        return {
            props: ...
        }
    }
    ```
3. 假设我们有一个显示博客信息列表的页面，静态生成时就需要先读取博客文章信息。下面是获取文章信息的一个模块，它会同步的读取博客文章文件，获取需要的信息并返回
    ```js
    // /libs/posts.js

    import fs from 'fs';
    import path from 'path';
    import matter from 'gray-matter';

    // 假设博客文件存放在文件系统中，路径为 /posts/
    const postsDirectory = path.join(process.cwd(), 'posts');

    export function getSortedPostsData() {
        // Get file names under /posts
        const fileNames = fs.readdirSync(postsDirectory);
        const allPostsData = fileNames.map((fileName) => {
            // Remove ".md" from file name to get id
            const id = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);
            console.log(matterResult.data.date, matterResult.data.title)
            // Combine the data with the id
            return {
                id,
                ...matterResult.data,
            };
        });
        // Sort posts by date
        return allPostsData.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    ```
4. 显示博客信息列表的页面文件中，`getStaticProps` 函数需要调用上面的 `getSortedPostsData` 函数来获取信息
    ```js
    // pages/index.js

    import Head from 'next/head';
    import Layout, { siteTitle } from '../components/layout';
    import utilStyles from '../styles/utils.module.css';

    import { getSortedPostsData } from '../lib/posts';

    export async function getStaticProps() {
        // 读取到信息
        const allPostsData = getSortedPostsData();
        // 把 {allPostsData} 传给 Home 组件
        return {
            props: {
                allPostsData,
            },
        };
    }

    // 通过参数获取 getStaticProps 传入的 props
    export default function Home({ allPostsData }) {
        return (
            <Layout home>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <section className={utilStyles.headingMd}>
                    <p>[Your Self Introduction]</p>
                    <p>
                        (This is a sample website - you’ll be building a site like this on{' '}
                        <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
                    </p>
                </section>

                <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                    <h2 className={utilStyles.headingLg}>Blog</h2>
                    <ul className={utilStyles.list}>
                        {allPostsData.map(({ id, date, title }) => (
                            <li className={utilStyles.listItem} key={id}>
                                {title}
                                <br />
                                {id}
                                <br />
                                {date}
                            </li>
                        ))}
                    </ul>
                </section>
            </Layout>
        );
    }
    ```
5. 上面的例子是从文件系统读取数据，当然也可以从其他来源，比如异步请求一个外部 API 或者直接请求数据库
    ```js
    export async function getSortedPostsData() {
        // Instead of the file system,
        // fetch post data from an external API endpoint
        const res = await fetch('..');
        return res.json();
    }
    ```
    ```js
    import someDatabaseSDK from 'someDatabaseSDK'

    const databaseClient = someDatabaseSDK.createClient(...)

    export async function getSortedPostsData() {
        // Instead of the file system,
        // fetch post data from a database
        return databaseClient.query('SELECT posts...')
    }
    ```
6. 因为 SG 的过程发生在 build 阶段，所以不可能获取到请求时的数据，比如请求参数、请求首部之类的。
7. 另外，`getStaticProps` 只能用在 **page** 文件中，one of the reasons for this restriction is that React needs to have all the required data before the page is rendered.


## Server-side Rendering
To use Server-side Rendering for a page, you need to export an `async` function called `getServerSideProps`. This function will be called by the server on every request
```js
export default function Page({ data }) {
  // Render data...
}
 
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`);
  const data = await res.json();
 
  // Pass data to the page via props
  return { props: { data } };
}
```


## SWR
1. The team behind Next.js has created a React hook for data fetching called SWR. We highly recommend it if you’re fetching data on the client side. It handles caching, revalidation, focus tracking, refetching on interval, and more.
2. Here’s an example usage:
    ```js
    import useSWR from 'swr';

    function Profile() {
        const { data, error } = useSWR('/api/user', fetch);

        if (error) return <div>failed to load</div>;
        if (!data) return <div>loading...</div>;
        return <div>hello {data.name}!</div>;
    }
    ```