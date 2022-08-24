# Understanding Kubernetes Objects


<!-- TOC -->

- [Understanding Kubernetes Objects](#understanding-kubernetes-objects)
    - [Summary](#summary)
    - [Object Spec and Status](#object-spec-and-status)
    - [Describing a Kubernetes object](#describing-a-kubernetes-object)
    - [Required Fields](#required-fields)
    - [References](#references)

<!-- /TOC -->


## Summary 
1. Kubernetes objects are persistent entities in the Kubernetes system. Kubernetes uses these entities to represent the state of your cluster. 
2. Specifically, they can describe:
    * What containerized applications are running (and on which nodes)
    * The resources available to those applications
    * The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance
3. A Kubernetes object is a "record of intent"--once you create the object, the Kubernetes system will constantly work to ensure that object exists. 
4. By creating an object, you're effectively telling the Kubernetes system what you want your cluster's workload to look like; this is your cluster's **desired state**.


## Object Spec and Status
1. Almost every Kubernetes object includes two nested object fields that govern the object's configuration: the object `spec` and the object `status`. 
2. For objects that have a `spec`, you have to set this when you create the object, providing a description of the characteristics you want the resource to have: its **desired state**.
3. The `status` describes the current state of the object, supplied and updated by the Kubernetes system and its components. The Kubernetes control plane continually and actively manages every object's actual state to match the desired state you supplied.
4. For example: in Kubernetes, a Deployment is an object that can represent an application running on your cluster. When you create the Deployment, you might set the Deployment `spec` to specify that you want three replicas of the application to be running. The Kubernetes system reads the Deployment spec and starts three instances of your desired application--updating the status to match your spec. If any of those instances should fail (a status change), the Kubernetes system responds to the difference between spec and status by making a correction--in this case, starting a replacement instance.


## Describing a Kubernetes object
1. When you create an object in Kubernetes, you must provide the object spec that describes its desired state, as well as some basic information about the object (such as a name). 
2. When you use the Kubernetes API to create the object (either directly or via kubectl), that API request must include that information as JSON in the request body. Most often, you provide the information to `kubectl` in a `.yaml` file. `kubectl` converts the information to JSON when making the API request.
3. Here's an example `.yaml` file that shows the required fields and object spec for a Kubernetes Deployment
    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
    spec:
      selector:
        matchLabels:
          app: nginx
      replicas: 2 # tells deployment to run 2 pods matching the template
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:1.14.2
            ports:
            - containerPort: 80
    ```
  

## Required Fields
1. In the `.yaml` file for the Kubernetes object you want to create, you'll need to set values for the following fields:
    * `apiVersion` - Which version of the Kubernetes API you're using to create this object
    * `kind` - What kind of object you want to create
    * `metadata` - Data that helps uniquely identify the object, including a `name` string, `UID`, and optional `namespace`
    * `spec` - What state you desire for the object
2. The precise format of the object spec is different for every Kubernetes object, and contains nested fields specific to that object.


## References
* [Understanding Kubernetes Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)
* [理解 Kubernetes 对象](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/)