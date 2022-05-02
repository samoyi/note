# Fragments


<!-- TOC -->

- [Fragments](#fragments)
    - [`<React.Fragment>`](#reactfragment)
    - [Keyed Fragments](#keyed-fragments)

<!-- /TOC -->


## `<React.Fragment>`
1. Fragments let you group a list of children without adding extra nodes to the DOM.
    ```js
    render() {
        return (
            <React.Fragment>
                <ChildA />
                <ChildB />
                <ChildC />
            </React.Fragment>
        );
    }
    ```
2. Short Syntax
    ```js
    class Columns extends React.Component {
        render() {
            return (
                <>
                    <td>Hello</td>
                    <td>World</td>
                </>
            );
        }
    }
    ```
3. You can use `<></>` the same way you’d use any other element except that it doesn’t support keys or attributes.


## Keyed Fragments
1. Fragments declared with the explicit `<React.Fragment>` syntax may have keys. 
    ```js
    function Glossary(props) {
        return (
            <dl>
                {props.items.map(item => (
                    // Without the `key`, React will fire a key warning
                    <React.Fragment key={item.id}>
                    <dt>{item.term}</dt>
                    <dd>{item.description}</dd>
                    </React.Fragment>
                ))}
            </dl>
        );
    }
    ```
2. `key` is the only attribute that can be passed to `Fragment`. In the future, we may add support for additional attributes, such as event handlers.

