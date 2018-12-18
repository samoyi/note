# Basic

## 核心功能
`vue-loader` is a loader for webpack that can transform Vue component written in `*.vue` file into a plain JavaScript module.


## 基本原理
`vue-loader` will parse the file, extract each language block, pipe them through other loaders if necessary, and finally assemble them back into a CommonJS module whose `module.exports` is a Vue.js component options object.


## 语言块基本语法与基本处理方式
### `<template>`
1. Default language: `html`.
2. Each `*.vue` file can contain at most one `<template>` block at a time.
3. Contents will be extracted as a string and used as the `template` option for the compiled Vue component.

### `<script>`
1. Default language: `js`.
2. Each `*.vue` file can contain at most one `<script>` block at a time.
3. The script is executed in a CommonJS like environment (just like a normal `.js` module bundled via webpack).
4. The script must export a Vue.js component options object. Exporting an extended constructor created by `Vue.extend()` is also supported, but a plain object is preferred.

### `<style>`
1. Default Language: `css`.
2. Multiple `<style>` tags are supported in a single `*.vue` file.
3. A `<style>` tag can have `scoped` or `module` attributes to help encapsulate the styles to the current component. Multiple `<style>` tags with different encapsulation modes can be mixed in the same component.
4. By default, contents will be extracted and dynamically inserted into the document's `<head>` as an actual `<style>` tag using `style-loader`.


## 导入外部语言块
1. If you prefer splitting up your `*.vue` components into multiple files, you can use the `src` attribute to import an external file for a language block:
    ```html
    <template src="./template.html"></template>
    <style src="./style.css"></style>
    <script src="./script.js"></script>
    ```
2. Beware that `src` imports follow the same path resolution rules to CommonJS `require()` calls, which means for relative paths you need to start with `./`, and you can import resources directly from installed NPM packages, e.g:
    ```html
    <!-- import a file from the installed "todomvc-app-css" npm package -->
    <style src="todomvc-app-css/index.css"></style>
    ```
3. `src` imports also work with custom blocks, e.g.:
    ```html
    <unit-test src="./unit-test.js">
    </unit-test>
    ```
