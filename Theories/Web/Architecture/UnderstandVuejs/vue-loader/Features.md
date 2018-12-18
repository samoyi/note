# Features

## ES2015
When vue-loader detects the presence of `babel-loader` or `buble-loader` in the same project, it will use them to process the `<script>` parts of all `*.vue` files, allowing us to use ES2015 in our Vue components.


## Scoped CSS
1. It is achieved by using PostCSS.
2. You can include both scoped and non-scoped styles in the same component:
    ```html
    <style>
    /* global styles */
    </style>

    <style scoped>
    /* local styles */
    </style>
    ```
3. DOM content created with `v-html` are not affected by scoped styles, but you can still style them using deep selectors.


## CSS Modules
1. Just add the `module` attribute to your `<style>`:
    ```html
    <style module>
    .red {
      color: red;
    }
    .bold {
      font-weight: bold;
    }
    </style>
    ```
2. This will turn on CSS Modules mode for `css-loader`, and the resulting class identifier object will be injected into the component as a computed property with the name `$style`. You can use it in your templates with a dynamic class binding:
    ```html
    <template>
      <p :class="$style.red">
        This should be red
      </p>
    </template>
    ```
3. Since it's a computed property, it also works with the object/array syntax of `:class`:
    ```html
    <template>
      <div>
        <p :class="{ [$style.red]: isRed }">
          Am I red?
        </p>
        <p :class="[$style.red, $style.bold]">
          Red and bold
        </p>
      </div>
    </template>
    ```
4. And you can also access it from JavaScript:
    ```html
    <script>
    export default {
      created () {
        console.log(this.$style.red)
        // -> "_1VyoJ-uZOjlOxP7jWUy19_0"
        // an identifier generated based on filename and className.
      }
    }
    </script>
    ```
5. You can have more than one `<style>` tags in a single `*.vue` component. To avoid injected styles to overwrite each other, you can customize the name of the injected computed property by giving the module attribute a value:
    ```html
    <style module="a">
      /* identifiers injected as a */
    </style>

    <style module="b">
      /* identifiers injected as b */
    </style>
    ```
6. CSS Modules are processed via `css-loader`. With `<style module>`, the default query used for css-loader is:
    ```js
    {
      modules: true,
      importLoaders: 1,
      localIdentName: '[hash:base64]'
    }
    ```
    You can use `vue-loader`'s `cssModules` option to provide additional query options to `css-loader`:
    ```js
    module: {
      rules: [
        {
          test: '\.vue$',
          loader: 'vue-loader',
          options: {
            cssModules: {
              localIdentName: '[path][name]---[local]---[hash:base64:5]',
              camelCase: true
            }
          }
        }
      ]
    }
    ```


## PostCSS
[没看](https://vue-loader-v14.vuejs.org/en/features/postcss.html)


## Hot Reload
With hot reload enabled, when you edit a `*.vue` file, all instances of that component will be swapped in without reloading the page. It even preserves the current state of your app and these swapped components. This dramatically improves the development experience when you are tweaking the templates or styling of your components.

### State Preservation Rules
* When editing the `<template>` of a component, instances of the edited component will re-render in place, preserving all current private state. This is possible because templates are compiled into new render functions that produce no side-effects.
* When editing the `<script>` part of a component, instances of the edited component will be destroyed and re-created in place. (State of the other components in the app are preserved) This is because `<script>` can include lifecycle hooks that may produce side-effects, so a "reload" instead of re-render is required to ensure consistent behavior. This also means you need to be careful about global side effects such as timers inside your components lifecycle hooks. Sometimes you may need to do a full-page reload if your component produces global side-effects.
* `<style>` hot reload operates on its own via `vue-style-loader`, so it doesn't affect application state.

### Disabling Hot Reload
1. Hot Reload is always enabled except following situations:
    * webpack `target` is `node` (SSR)
    * webpack minifies the code
    * `process.env.NODE_ENV === 'production'`
2. You may use `hotReload: false` option to disable the Hot Reload explicitly:
    ```js
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            hotReload: false // disables Hot Reload
          }
        }
      ]
    }
    ```
