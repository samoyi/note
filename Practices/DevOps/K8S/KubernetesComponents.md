# Kubernetes Components


<!-- TOC -->

- [Kubernetes Components](#kubernetes-components)
    - [Summary](#summary)
    - [Node Components](#node-components)
        - [kubelet](#kubelet)
        - [kube-proxy](#kube-proxy)
        - [Container runtime](#container-runtime)
    - [References](#references)

<!-- /TOC -->


## Summary
1. When you deploy Kubernetes, you get a cluster  
    <img src="../images/03.svg" width="1000" style="display: block; margin: 5px 0 10px;" />
2. A Kubernetes cluster consists of a set of worker machines, called **nodes**, that run containerized applications. 
3. A node is a work machine in Kubernetes. Every cluster has at least one worker node.
4. The worker node(s) host the **Pods** that are the components of the application workload. A Pod represents a set of running containers in your cluster.
5. The control plane manages the worker nodes and the Pods in the cluster. In production environments, the control plane usually runs across multiple computers and a cluster usually runs multiple nodes, providing fault-tolerance and high availability.


## Node Components
Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet
1. An agent that runs on each node in the cluster. It makes sure that containers are running in a Pod.
2. The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. 
3. The kubelet doesn't manage containers which were not created by Kubernetes.

### kube-proxy
1. kube-proxy is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service (A way to expose an application running on a set of Pods as a network service.) concept.
2. kube-proxy maintains network rules on nodes. These network rules allow network communication to your Pods from network sessions inside or outside of your cluster.

### Container runtime
1. The container runtime is the software that is responsible for running containers.
2. Kubernetes supports container runtimes such as Docker, containerd, CRI-O, and any other implementation of the Kubernetes CRI (Container Runtime Interface).


## References
* [Kubernetes Components](https://kubernetes.io/docs/concepts/overview/components/)
* [Kubernetes 组件](https://kubernetes.io/zh-cn/docs/concepts/overview/components/)