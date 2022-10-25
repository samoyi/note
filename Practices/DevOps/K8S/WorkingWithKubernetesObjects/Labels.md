# Labels


## 用途
1. Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion, without requiring clients to store these mappings.
2. 例如你有一组对象，有些属于开发环境，有些属于测试环境，有些属于生产环境。如果开发环境出了问题，你就想要快速的查看其中属于开发环境的对象。
3. 如果没有标签，你可能就要通过比较复杂的方法来识别出来哪些对象是属于开发环境的，因为这些对象上并没有针对环境有明确的标记。
4. 但如果你给每个对象都打上了一个例如 `environment` 的标签，然后根据其环境分别设置 `dev`、`test` 或 `pros` 的标签值。例如：
    ```yaml
    metadata:
      name: label-demo
      labels:
        environment: dev
    ```
5. 那么现在搜索时，你可以直接通过 `environment` 标签直接挑选出某个环境的对象。例如下面的命令就只会列出属于开发环境的对象
    ```sh
    kubectl get pods -l 'environment in (dev)'
    ```


## References
* [中文文档](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/labels/)
* [英文文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
* [Kubernetes labels: 11 things to know](https://www.redhat.com/sysadmin/kubernetes-labels-best-practices)
* [Kubernetes Labels](https://www.densify.com/kubernetes-autoscaling/kubernetes-labels)