# Usage

<!-- TOC -->

- [Usage](#usage)
    - [3 possible APIs](#3-possible-apis)
        - [Hook API](#hook-api)
        - [Styled components API](#styled-components-api)
        - [Higher-order component API](#higher-order-component-api)
    - [Nesting selectors](#nesting-selectors)
    - [Adapting based on props](#adapting-based-on-props)
    - [References](#references)

<!-- /TOC -->


## 3 possible APIs
There are 3 possible APIs you can use to generate and apply styles, however they all share the same underlying logic.

### Hook API
```js
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    root: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "white",
        height: 48,
        padding: "0 30px",
    },
});

export default function Hook() {
    const classes = useStyles();
    return <Button className={classes.root}>Hook</Button>;
}
```

### Styled components API
```js
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
});

export default function StyledComponents() {
    return <MyButton>Styled Components</MyButton>;
}
```

### Higher-order component API
```js
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = {
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
};

function HigherOrderComponent(props) {
    const { classes } = props;
    return <Button className={classes.root}>Higher-order component</Button>;
}

HigherOrderComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HigherOrderComponent);
```


## Nesting selectors
```js
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        color: 'red',
        '& p': {
            margin: 0,
            color: 'green',
            '& span': {
                color: 'blue',
            },
        },
    },
});

export default function NestedStylesHook() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      This is red since it is inside the root.
      <p>
        This is green since it is inside the paragraph{' '}
        <span>and this is blue since it is inside the span</span>
      </p>
    </div>
  );
}
```
`div` 是红色，`p` 是绿色，`span` 是蓝色。


## Adapting based on props
1. 可以给 `makeStyles` 参数对象里的类名属性设置为函数值，也可以给类名对象里面的样式名属性设置为函数，通过函数的返回值来设置类的一组样式或者是一个样式的样式值。
2. 这样做的主要好处是可以让函数来接收参数，根据不同的参数值来设置不同的样式。`makeStyles` 返回的 `useStyles` 接收的参数会传递给上述设置的函数。最常见的就是接收组件的 props 作为参数。
    ```js
    const useStyles = makeStyles({
        // 这个函数返回了 foo 这个类的一组（这里只有一个）样式
        foo: props => ({
            backgroundColor: props.backgroundColor,
        }),
        bar: {
            // 这个函数返回了 color 这个样式的样式值
            color: props => props.color,
        },
    });

    function MyComponent() {
        // 模拟外部传入的 props
        const props = { backgroundColor: 'black', color: 'white' };
        
        const classes = useStyles(props);

        return <div className={`${classes.foo} ${classes.bar}`} />
    }
    ```
3. 下面这个例子展示了函数根据参数的不同值设置不同的样式
    ```ts
    import React from 'react';
    import { makeStyles } from '@material-ui/core/styles';
    import Button, { ButtonProps as MuiButtonProps } from '@material-ui/core/Button';
    import { Omit } from '@material-ui/types';

    interface Props {
        color: 'red' | 'blue';
    }

    const useStyles = makeStyles({
        root: {
            // 根据 props 中设置的不同字体色来设置相应的背景色
            background: (props: Props) =>
                props.color === 'red'
                    ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
                    : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            border: 0,
            borderRadius: 3,
            // 根据 props 中设置的不同字体色来设置相应的阴影
            boxShadow: (props: Props) =>
                props.color === 'red'
                    ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
                    : '0 3px 5px 2px rgba(33, 203, 243, .3)',
            color: 'white',
            height: 48,
            padding: '0 30px',
            margin: 8,
        },
    });

    function MyButton(props: Props & Omit<MuiButtonProps, keyof Props>) {
        const { color, ...other } = props;
        // 组件接收 props 并传递给 useStyles，进而传递给上面设置的两个函数
        const classes = useStyles(props);
        return <Button className={classes.root} {...other} />;
    }

    export default function AdaptingHook() {
        return (
            <React.Fragment>
                <MyButton color="red">Red</MyButton>
                <MyButton color="blue">Blue</MyButton>
            </React.Fragment>
        );
    }
    ```


## References
* [Material-UI](https://v4.mui.com/styles/basics/)
