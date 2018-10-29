# Lists


## Keys
关于`key`的分析，看这一篇：
`Theories\Web\Architecture\UnderstandReact\原理\Reconciliatio.md`。或者
[这个回答](https://www.zhihu.com/question/61064119/answer/183717717)，很清晰的解释
了使用`key`的原因。

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
