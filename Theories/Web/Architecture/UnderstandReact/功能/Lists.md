# Lists


<!-- TOC -->

- [Lists](#lists)
    - [Keys](#keys)
    - [错误使用的情况](#错误使用的情况)
        - [使用随机数作为 key 的问题](#使用随机数作为-key-的问题)
    - [References](#references)

<!-- /TOC -->


## Keys
关于 `key` 的分析，看这一篇：
`Theories\Web\Architecture\UnderstandReact\原理\Reconciliation.md`。或者 [这个问题](https://www.zhihu.com/question/61064119)，很清晰的解释了使用 `key` 的原因。


## 错误使用的情况
### 使用随机数作为 key 的问题
1. key 的本意，就是用来标识唯一的元素。那么如果一个元素不变，它的 key 当然也不应改变。
2. 但是如果用随机数作为 key，则每次父级重渲染时，这个随机数 key 都会改变，它所在的元素就永远无法复用。
3. 这种错误出现在表单元素上会特别明显，比如 `<input key={Math.random()} onChange={handleChange}>` 中的 `handleChange` 会改变父级状态导致重渲染，那么每输入一个字符引发重渲染时，`<input />` 因为 key 更新了导致不能复用，因此会销毁并重建。
4. 此时
    * 如果 `<input />` 自己维持数据，那数据就会丢失
        ```ts
        function Foo () {
            const [upperName, setUpperName] = useState("")
            const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
                setUpperName(ev.target.value.toUpperCase());
            } 
            return (<form>
                <p key={Math.random()}>Name: <input onChange={onChange} type="text" /><span>{upperName}</span></p >
            </form>)
        }
        ```
    * 如果数据维持在外部，数据虽然不会丢失，但因为是新建的 `<input />`，所以也会失去焦点
        ```ts
        function Foo () {
            const [name, setName] = useState("")
            const [upperName, setUpperName] = useState("")
            const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
                setName(ev.target.value);
                setUpperName(ev.target.value.toUpperCase());
            } 
            return (<form>
                <p key={Math.random()}>Name: <input onChange={onChange} value={name} type="text" /><span>{upperName}</span></p >
            </form>)
        }
        ```


## References
* [列表 & Key](https://react.docschina.org/docs/lists-and-keys.html)