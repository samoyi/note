# Styles

**基于 MUI 4 版本**
<!-- TOC -->

- [Styles](#styles)
    - [3 possible APIs](#3-possible-apis)
        - [Hook API](#hook-api)
        - [Styled components API](#styled-components-api)
        - [Higher-order component API](#higher-order-component-api)
    - [Nesting selectors](#nesting-selectors)
    - [Adapting based on props](#adapting-based-on-props)
        - [Adapting the hook API](#adapting-the-hook-api)
        - [Adapting the styled components API](#adapting-the-styled-components-api)
        - [Adapting the higher-order component API](#adapting-the-higher-order-component-api)
    - [References](#references)

<!-- /TOC -->


## 3 possible APIs 
### Hook API
```js
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
});

export default function Hook() {
    const classes = useStyles();
    return <Button className={classes.root}>Styled with Hook API</Button>;
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
    return <MyButton>Styled with styled-components API</MyButton>;
} 
```

### Higher-order component API
TODO
```js
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
    return <Button className={classes.root}>Styled with HOC API</Button>;
}

HigherOrderComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HigherOrderComponent);
```


## Nesting selectors
1. You can nest selectors to target elements inside the current class or component. 
2. The following example uses the Hook API, but it works the same way with the other APIs
    ```js
    import { makeStyles } from '@material-ui/core/styles';

    const useStyles = makeStyles({
        root: {
            color: 'red',
            '& p': {
                color: 'green',
                '& span': {
                    color: 'blue'
                }
            }
        },  
    });

    function MyComponent() {
        const classes = useStyles();
        return (
            <div className={classes.root}>
                red div
                <p>
                    green p
                    <span>
                        blue span
                    </span>
                </p>
            </div>
        );
    }
    ```


## Adapting based on props
1. You can pass a function to `makeStyles` ("interpolation") in order to adapt the generated value based on the component's props. 
### Adapting the hook API
The function can be provided at the style rule level, or at the CSS property level。
```js
const useStyles = makeStyles({
    // style rule
    foo: props => ({
        backgroundColor: props.backgroundColor,
    }),
    bar: {
        // CSS property
        color: props => props.color,
    },
});

function MyComponent(props) {
    // Pass the props as the first argument of useStyles()
    const classes = useStyles(props);

    return <div className={`${classes.foo} ${classes.bar}`}>MyComponent</div>
}

const App = () => {
    return (
        <div>
            <MyComponent backgroundColor="black" color="white" />
        </div>
    )
}
```
TODO，上面的例子在测试时，在文件保存时页面自动更新可以看到样式，但手动刷新页面后样式就会消失。

### Adapting the styled components API
TODO

### Adapting the higher-order component API
TODO


## References
* [@material-ui/styles](https://v4.mui.com/styles/basics/)