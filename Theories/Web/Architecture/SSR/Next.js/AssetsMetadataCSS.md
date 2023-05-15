# Assets, Metadata, and CSS


<!-- TOC -->

- [Assets, Metadata, and CSS](#assets-metadata-and-css)
    - [Assets](#assets)
    - [Image Component and Image Optimization](#image-component-and-image-optimization)
    - [Metadata](#metadata)
        - [在每个页面设置各自的页面 `<head>`](#在每个页面设置各自的页面-head)
    - [Third-Party JavaScript](#third-party-javascript)
    - [CSS](#css)
        - [CSS Modules](#css-modules)
        - [Global Styles](#global-styles)
        - [Using Sass](#using-sass)

<!-- /TOC -->


## Assets
1. Next.js can serve static assets, like images, under the top-level `public` directory. 
2. Files inside `public` can be referenced from the root of the application similar to pages. 也就是说，比如你想要引用 `/public/images/` 里面的图片时，路径直接写 `/images/` 就行了。


## Image Component and Image Optimization
1. 使用默认的图片标签，你可能需要自己进行不限于下面的若干种优化
    * 让图片在不同尺寸的屏幕下实现响应式
    * 使用第三方工具压缩图片
    * 进入可视区域时才懒加载
2. Next.js 提供了 Image 组件可以自动完成上述优化。包括：
    * resizing 实现图片响应式
    * 压缩
    * serving images in modern formats like WebP when the browser supports it. 
    * 进入可视区域时才懒加载
3. Automatic Image Optimization works with any image source. Even if the image is hosted by an external data source, like a CMS, it can still be optimized.
4. Next.js 并不是在构建时优化图片，而是在用户需要请求图片时才优化。Unlike static site generators and static-only solutions, your build times aren't increased, whether shipping 10 images or 10 million images.
5. Images are always rendered in such a way as to avoid [Cumulative Layout Shift](https://web.dev/cls/), a Core Web Vital that Google is going to use in search ranking.
6. Here's an example using next/image to display our profile picture. The `height` and `width` props should be the desired rendering size, with an aspect ratio identical to the source image
    ```js
    import Image from 'next/image';

    const YourComponent = () => (
        <Image
            src="/images/profile.jpg" // Route of the image file
            height={144} // Desired size with correct aspect ratio
            width={144} // Desired size with correct aspect ratio
            alt="Your Name"
        />
    );
    ```


## Metadata
### 在每个页面设置各自的页面 `<head>`
`<Head>` is a React Component that is built into Next.js. It allows you to modify the `<head>` of a page
```html
<Head>
  <title>Create Next App</title>
  <link rel="icon" href="/favicon.ico" />
</Head>
```


## Third-Party JavaScript
1. 虽然可以直接在 `<Head>` 里面引用脚本，但并不推荐
    ```html
    <Head>
        <title>First Post</title>
        <script src="https://connect.facebook.net/en_US/sdk.js" />
    </Head>
    ```
2. Although this approach works, including scripts in this manner does not give a clear idea of when it would load with respect to the other JavaScript code fetched on the same page. 
3. 如果一个脚本导致阻塞渲染，将会延迟页面内容的加载，显著影响应能。
4. 应该使用 Next.js 提供的优化后的 `<Script>` 组件引用脚本
    ```html
    <Head>
        <title>First Post</title>
    </Head>
    <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
    />
    ```
    * `strategy` controls when the third-party script should load. A value of lazyOnload tells Next.js to load this particular script lazily during browser idle time
    * `onLoad` is used to run any JavaScript code immediately after the script has finished loading.


## CSS
### CSS Modules
1. CSS modules allow you to locally scope CSS at the component-level by automatically creating unique class names. 
2. 定义一个样式模块，后缀必须是 `.module.css`
    ```css
    /* `components/layout.module.css` */
    .container {
        max-width: 36rem;
        padding: 0 1rem;
        margin: 3rem auto 6rem;
    }
    ```
3. 引用模块并使用模块化的样式
    ```js
    import styles from './layout.module.css';

    export default function Layout({ children }) {
        return <div className={styles.container}>{children}</div>;
    }
    ```
4. 引用这个样式类名的元素上最终会生成一个不重复的类名，例如
    ```html
    <div class="layout_container__fbLkO">
    ```
5. Next.js 会对 CSS 模块进行代码分割，只有当前组件用到该模块的使用才加载。组件里没有引用 CSS 模块、或者引用但没有实际使用其中的类时，都不会加载对应的模块。
6. CSS Modules are extracted from the JavaScript bundles at build time and generate .css files that are loaded automatically by Next.js.

### Global Styles
1. 全局的样式需要加在 `<App>` 组件上，但这个组件没有直接暴露，你需要创建一个 `pages/_app.js` 来覆盖它。
2. 创建全局样式文件 `styles/globals.css`，然后在 `pages/_app.js` 中引入
    ```js
    // `pages/_app.js`
    import '../styles/globals.css';

    export default function App({ Component, pageProps }) {
        return <Component {...pageProps} />;
    }
    ```
3. 现在，`styles/globals.css` 中的样式将在全局生效。文档上说如果没生效需要重启开发服务器，不过我这里并不需要重启。

    
###  Using Sass
1. Out of the box, Next.js allows you to import Sass using both the `.scss` and `.sass` extensions. 2. You can use component-level Sass via CSS Modules and the `.module.scss` or `.module.sass` extension.
3. Before you can use Next.js' built-in Sass support, be sure to install sass.