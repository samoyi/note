# Basic


<!-- TOC -->

- [Basic](#basic)
    - [What is a Pod?](#what-is-a-pod)
    - [Using Pods](#using-pods)
        - [Workload resources for managing pods](#workload-resources-for-managing-pods)
            - [Replication](#replication)
        - [How Pods manage multiple containers](#how-pods-manage-multiple-containers)
    - [Working with Pods](#working-with-pods)
        - [Pods and controllers](#pods-and-controllers)
        - [Pod templates](#pod-templates)
    - [References](#references)

<!-- /TOC -->


## What is a Pod?
1. Pods are the smallest deployable units of computing that you can create and manage in Kubernetes.
2. A Pod is a group of one or more containers(就像一个豌豆荚包含若干个豌豆), with shared storage and network resources, and a specification for how to run the containers.
3. A Pod's contents are always co-located and co-scheduled, and run in a shared context. 
4. A Pod models an application-specific "logical host": it contains one or more application containers which are relatively tightly coupled. 
5. While Kubernetes supports more container runtimes than just Docker, Docker is the most commonly known runtime, and it helps to describe Pods using some terminology from Docker.
6. The shared context of a Pod is a set of Linux namespaces, cgroups, and potentially other facets of isolation - the same things that isolate a Docker container. 
7. Within a Pod's context, the individual applications may have further sub-isolations applied.
8. In terms of Docker concepts, a Pod is similar to a group of Docker containers with shared namespaces and shared filesystem volumes.
9. The following is an example of a Pod which consists of a container running the image `nginx:1.14.2`
    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
    ```


## Using Pods
### Workload resources for managing pods
1. Usually you don't need to create Pods directly, even singleton Pods. Instead, create them using workload resources such as Deployment or Job. If your Pods need to track state, consider the StatefulSet resource.
2. Pods in a Kubernetes cluster are used in two main ways
    * **Pods that run a single container**
        1. The "one-container-per-Pod" model is the most common Kubernetes use case; 
        2. in this case, you can think of a Pod as a wrapper around a single container; 
        3. Kubernetes manages Pods rather than managing the containers directly.
    * **Pods that run multiple containers that need to work together**
        1. A Pod can encapsulate an application composed of multiple co-located containers that are tightly coupled and need to share resources. 
        2. These co-located containers form a single cohesive unit of service—for example, one container serving data stored in a shared volume to the public, while a separate sidecar container refreshes or updates those files. 
        3. The Pod wraps these containers, storage resources, and an ephemeral network identity together as a single unit.
3. Grouping multiple co-located and co-managed containers in a single Pod is a relatively advanced use case. You should use this pattern only in specific instances in which your containers are tightly coupled.

#### Replication
1. Each Pod is meant to run a single instance of a given application. 
2. If you want to scale your application horizontally (to provide more overall resources by running more instances), you should use multiple Pods, one for each instance. 
3. In Kubernetes, this is typically referred to as replication. 
4. Replicated Pods are usually created and managed as a group by a workload resource and its controller.

### How Pods manage multiple containers
1. Pods are designed to support multiple cooperating processes (as containers) that form a cohesive unit of service. 
2. The containers in a Pod are automatically co-located and co-scheduled on the same physical or virtual machine in the cluster. 
3. The containers can share resources and dependencies, communicate with one another, and coordinate when and how they are terminated.
4. For example, you might have a container that acts as a web server for files in a shared volume, and a separate "sidecar" container that updates those files from a remote source, as in the following diagram
    <img src="../../../images/02.svg" width="400" style="display: block; margin: 5px 0 10px;" />
    A multi-container Pod that contains a file puller and a web server that uses a persistent volume for shared storage between the containers.
5. Pods natively provide two kinds of shared resources for their constituent containers: networking and storage.
6. Some Pods have init containers as well as app containers. Init containers run and complete before the app containers are started.


## Working with Pods
1. You'll rarely create individual Pods directly in Kubernetes—even singleton Pods. This is because Pods are designed as relatively ephemeral, disposable entities. 
2. When a Pod gets created (directly by you, or indirectly by a controller), the new Pod is scheduled to run on a Node in your cluster. The Pod remains on that node until the Pod finishes execution, the Pod object is deleted, the Pod is evicted for lack of resources, or the node fails.
3. Restarting a container in a Pod should not be confused with restarting a Pod. A Pod is not a process, but an environment for running container(s). A Pod persists until it is deleted.

### Pods and controllers
1. You can use workload resources to create and manage multiple Pods for you. A controller for the resource handles replication and rollout and automatic healing in case of Pod failure. 
2. For example, if a Node fails, a controller notices that Pods on that Node have stopped working and creates a replacement Pod. The scheduler places the replacement Pod onto a healthy Node.

### Pod templates 
1. Controllers for workload resources create Pods from a pod template and manage those Pods on your behalf.
2. PodTemplates are specifications for creating Pods, and are included in workload resources such as Deployments, Jobs, and DaemonSets.
3. Each controller for a workload resource uses the PodTemplate inside the workload object to make actual Pods. The PodTemplate is part of the desired state of whatever workload resource you used to run your app.
4. The sample below is a manifest for a simple Job with a template that starts one container. The container in that Pod prints a message then pauses
    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      name: hello
    spec:
      template:
        # This is the pod template
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
          restartPolicy: OnFailure
        # The pod template ends here
    ```
5. Modifying the pod template or switching to a new pod template has no direct effect on the Pods that already exist. If you change the pod template for a workload resource, that resource needs to create replacement Pods that use the updated template.
6. Each workload resource implements its own rules for handling changes to the Pod template.


## References
* [Pods](https://kubernetes.io/docs/concepts/workloads/pods/)