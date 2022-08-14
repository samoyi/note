# react-diagrams


## Bugs
### `Cannot read property 'offsetWidth' of null`
1. 可能的错误信息：`Uncaught TypeError. Cannot read property 'offsetWidth' of null in PathFindingLinkFactory calculateMatrixDimensions`。
2. 参考这个 [issue](https://github.com/projectstorm/react-diagrams/issues/671)。
3. 解决方法是 `useEffect` 加 `setTimeout`，参考 `Practices/FE/Demos/react-diagrams自定义节点/Artifact/DataFlow/index.tsx`。



## References
[issue 671](https://github.com/projectstorm/react-diagrams/issues/671)