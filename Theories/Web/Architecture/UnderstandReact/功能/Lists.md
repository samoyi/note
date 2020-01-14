# Lists


## Embedding `map()` in JSX
1. We can declare a separate `listItems` variable and included it in JSX:
    ```js
    function NumberList(props) {
        const numbers = props.numbers;
        const listItems = numbers.map((number) =>
            <ListItem key={number.toString()}
                    value={number} />
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
    }
    ```
2. JSX allows embedding any expression in curly braces so we could inline the `map()` result:
    ```js
    function NumberList(props) {
    const numbers = props.numbers;
    return (
        <ul>
        {numbers.map((number) =>
            <ListItem key={number.toString()}
                    value={number} />

        )}
        </ul>
    );
    }
    ```
3. Sometimes this results in clearer code, but this style can also be abused. Like in JavaScript, it is up to you to decide whether it is worth extracting a variable for readability. Keep in mind that if the `map()` body is too nested, it might be a good time to extract a component.


## Keys
关于`key`的分析，看这一篇：
`Theories\Web\Architecture\UnderstandReact\原理\Reconciliatio.md`。或者[这个回答](https://www.zhihu.com/question/61064119/answer/183717717)，很清晰的解释了使用`key`的原因。

```js
function NumberList(props) {
    const numbers = props.numbers;
    const listItems = numbers.map((number) => {
        return <li key={number.toString()}> {number} </li>;
    });
    return (
        <ul>{listItems}</ul>
    );
}

const numbers = [1, 2, 3, 4, 5];

ReactDOM.render(
    <NumberList numbers={numbers} />,
    document.getElementById('root')
);
```
