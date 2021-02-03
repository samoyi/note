# Input Event


<!-- TOC -->

- [Input Event](#input-event)
    - [`input`](#input)
        - [输入字母](#输入字母)
        - [输入汉字](#输入汉字)
        - [直接粘贴](#直接粘贴)
        - [任何形式的删除都会触发该事件](#任何形式的删除都会触发该事件)
        - [`inputType` 属性](#inputtype-属性)
    - [composition 事件](#composition-事件)
        - [`compositionstart`](#compositionstart)
        - [`compositionupdate`](#compositionupdate)
        - [`compositionend`](#compositionend)
        - [`ev.isTrusted`](#evistrusted)

<!-- /TOC -->


## `input`
从字面上的理解，就是输入，即输入触发的事件。

### 输入字母
1. 在输入字母和数字时，这完全符合预期，`ev.data` 就是每次输入事件时的值。
2. 例如输入 `hello`，总共会输入 5 次，触发 5 次 `input` 事件，每次的 `ev.data` 分别是：`h`、`e`、`l`、`l`、`o`。

### 输入汉字
1. 但用拼音输入 “你好” 的时候，则不是那么直观。而且根据输入法的不同而不同。
2. 输入 “你好” 总共要按 6 次键：`n`、`i`、`h`、`a`、`o` 和空格。
3. 我在 window 10 使用搜狗输入法时，只会触发两次事件。按下 `n` 时，触发一次，`ev.data` 是一个空格(`" "`)；最后按下空格时再触发一次，`ev.data` 是汉字 `"你好"`。
4. 而使用微软拼音输入法时，会触发十二次事件！`ev.data` 分别是
    ```sh
    n
    n
    ni
    ni
    ni'h
    ni'h
    ni'ha
    ni'ha
    ni'hao
    ni'hao
    你好
    你好
    ```
5. 按照 [规范](https://w3c.github.io/uievents/#event-type-input)上的说法：A user agent MUST dispatch this event immediately after the DOM has been updated。
6. 搜狗输入法时，输入的时候注意观察，在按下 `n` 之后，输入框里会出现一个空格，之后四个字母按下后输入框不会变化，最后按下空格，输入框变成汉字。因为只有按下 `n` 和空格的时候 DOM 才会发生变化，所以只会触发两次事件处理。
7. 而微软输入发每次输入字母，输入框里面都会发生变化。只是不知道为啥每次都触发两次。

### 直接粘贴
会触发一次 `input`，但是 `ev.data` 值为 `null`。

### 任何形式的删除都会触发该事件
`ev.data` 值为 `null`。

### `inputType` 属性
1. 每次触发事件，根据触发的类型，`inputType` 属性值都会有所不同。
2. 尝试了一下几种类型：
    * 输入字母或者数字： `insertText`
    * 拼音输入时按下字母或者最后按下空格：`insertCompositionText`
    * 粘贴：`insertFromPaste`
    * backspace 键删除：`deleteContentBackward`
    * delete 键删除：`deleteContentForward`
    * 剪切：`deleteByCut`


## composition 事件
### `compositionstart`
1. The `compositionstart` event is fired when the composition of a passage of text is prepared (similar to `keydown` for a keyboard input, but fires with special characters that require a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).
2. 例如使用拼音输入法时，开始输入拼音的时候就会触发该事件。
3. 这个事件获得不了关于输入的有用信息，输入的信息要使用下面的 `compositionupdate` 事件来获得

### `compositionupdate`
1.  The `compositionupdate` event is fired when a character is added to a passage of text being composed (fires with special characters that require a sequence of keys and other inputs such as speech recognition or word suggestion on mobile).
2. 通过 `ev.data` 获取输入到输入框里的字符，效果和上面 `input` 事件的 `ev.data`。例如输入中文 “你好”
    * 在搜狗输入法中，按下 `n` 时，会触发 `compositionupdate` 事件，`ev.data` 是一个空格；之后输入 `i`、`h`、`a`、`o` 都不会触发，因为输入框里没有变化；最后按下空格后，会第二次也是最后一次触发 `compositionupdate` 事件，`ev.data` 是 “你好”。
    * 在微软输入法中，按下 `n`、`i`、`h`、`a`、`o` 和空格，每次都会重复触发两次 `compositionupdate` 事件，`ev.data` 也和上面的 `input` 事件时一样。
3. 所以，你不能通过这个事件来实时的判断用户按下的字母。

### `compositionend`
1. The `compositionend` event is fired when the composition of a passage of text has been completed or cancelled (fires with special characters that require a sequence of keys and other inputs such as speech recognition or word suggestion
on mobile).
2. `ev.data` 获得是最终生成的字符串，例如拼音生成的汉字。

### `ev.isTrusted`
`compositionstart` 和 `compositionupdate` 的 `ev.isTrusted` 都是 `true`，`compositionend` 是 `false`。