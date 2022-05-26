# Typography

<!-- TOC -->

- [Typography](#typography)
    - [General](#general)
    - [`Typography` 组件](#typography-组件)
    - [Theme](#theme)
    - [References](#references)

<!-- /TOC -->


## General
1. Use typography to present your design and content as clearly and efficiently as possible. 看起来这里的作用就是让你的文字排版更加的统一并且合适。
2. 不懂，文档说可以安装 Roboto 字体，不知道什么意思。


## `Typography` 组件
1. 这个组件可以对内部的文字进行排版。并且还可以在保持语义化的前提下修改文字的样式，例如仍然使用 `<h2>` 但是显示出 `<h1>` 的效果
    ```html
    <Typography variant="h1" component="h2" gutterBottom>
        h1. Heading
    </Typography>
    ```
2. 注意节点的层级结构。例如 `Typography` 的 `component` 设置的 `<p>`，但子节点里由插入了 `div`，就会引发下面的报错
    ```
    Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
    ```
2. [所有的属性](https://mui.com/material-ui/api/typography/#props) 


## Theme
1. 除了使用 `Typography` 组件外，还可以为某个元素使用某种类型的样式主题。例如下面为 `<div>` 里的文字应用了 `button` 主题，让这段文字看起来像个按钮
    ```ts
    import React from 'react';
    import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                ...theme.typography.button,
                backgroundColor: theme.palette.background.paper,
                padding: theme.spacing(1),
            },
        }),
    );

    export default function TypographyTheme() {
        const classes = useStyles();

        return <div className={classes.root}>{"This div's text looks like that of a button."}</div>;
    }
    ```
2. 设置全局字体映射。TODO，怎么用
    ```ts
    const theme = createTheme({
        props: {
            MuiTypography: {
                variantMapping: {
                    h1: 'h2',
                    h2: 'h2',
                    h3: 'h2',
                    h4: 'h2',
                    h5: 'h2',
                    h6: 'h2',
                    subtitle1: 'h2',
                    subtitle2: 'h2',
                    body1: 'span',
                    body2: 'span',
                },
            },
        },
    });
    ```


## References
* [Material-UI](https://v4.mui.com/zh/api/typography/)
* [Material-UI](https://mui.com/material-ui/react-typography/)