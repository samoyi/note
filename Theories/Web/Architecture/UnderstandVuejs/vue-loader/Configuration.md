# Configuration

## Pre-Processors
直接看[文档](https://vue-loader-v14.vuejs.org/en/configurations/pre-processors.html)


## Asset URL Handling
1. By default, `vue-loader` automatically processes your style and template files with `css-loader` and the Vue template compiler. In this compilation process, all asset URLs such as `<img src="...">`, `background: url(...)` and CSS `@import` are resolved as module dependencies.
2. For example, `url(./image.png)` will be translated into `require('./image.png')`, and `<img src="../image.png">` will be compiled into: `createElement('img', { attrs: { src: require('../image.png') }})`

### Transform Rules
* If the URL is an absolute path (e.g. /images/foo.png), it will be preserved as-is.
* If the URL starts with `.`, it's interpreted as a relative module request and resolved based on the folder structure on your file system.
* If the URL starts with `~`, anything after it is interpreted as a module request. This means you can even reference assets inside node modules:
    ```html
    <img src="~some-npm-package/foo.png">
    ```

### Related Loaders
Because `.png` is not a JavaScript file, you will need to configure webpack to use `file-loader` or `url-loader` to handle them. The project scaffolded with `vue-cli` has also configured this for you.


## Advanced Loader Configuration
1. Sometimes you may want to:
    * Apply a custom loader string to a language instead of letting `vue-loader` infer it;
    * Overwrite the built-in loader configuration for the default languages;
    * Pre-process or post-process a specific language block with custom loaders.
2. To do that, specify the `loaders` option for `vue-loader`:
    ```js
    module.exports = {
      // other options...
      module: {
        // `module.rules` is the same as `module.loaders` in 1.x
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              // `loaders` will overwrite the default loaders.
              // The following config will cause all `<script>` tags without `lang`
              // attribute to be loaded with `coffee-loader`
              loaders: {
                js: 'coffee-loader'
              },

              // `preLoaders` are attached before the default loaders.
              // You can use this to pre-process language blocks - a common use
              // case would be build-time i18n.
              preLoaders: {
                js: '/path/to/custom/loader'
              },

              // `postLoaders` are attached after the default loaders.
              //
              // - For `html`, the result returned by the default loader
              //   will be compiled JavaScript render function code.
              //
              // - For `css`, the result will be returned by `vue-style-loader`
              //   which isn't particularly useful in most cases. Using a PostCSS
              //   plugin will be a better option.
              postLoaders: {
                html: 'babel-loader'
              },

              // `excludedPreLoaders` should be regex
              excludedPreLoaders: /(eslint-loader)/
            }
          }
        ]
      }
    }
    ```


## Extracting CSS into a Single File
直接看[文档](https://vue-loader-v14.vuejs.org/en/configurations/extract-css.html)


## Custom Blocks
直接看[文档](https://vue-loader-v14.vuejs.org/en/configurations/custom-blocks.html)
