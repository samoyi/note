# Pod Lifecycle


<!-- TOC -->

- [Pod Lifecycle](#pod-lifecycle)
    - [Summary](#summary)
    - [Pod lifetime](#pod-lifetime)
    - [Pod phase](#pod-phase)
    - [Container states](#container-states)
        - [Waiting](#waiting)
        - [Running](#running)
        - [Terminated](#terminated)
    - [Container restart policy](#container-restart-policy)
    - [References](#references)

<!-- /TOC -->


## Summary
1. Pods follow a defined lifecycle, starting in the `Pending` phase, moving through `Running` if at least one of its primary containers starts OK, and then through either the `Succeeded` or `Failed` phases depending on whether any container in the Pod terminated in failure.
2. Whilst a Pod is running, the kubelet is able to restart containers to handle some kind of faults. Within a Pod, Kubernetes tracks different container states and determines what action to take to make the Pod healthy again.
3. In the Kubernetes API, Pods have both a specification and an actual status. The status for a Pod object consists of a set of Pod conditions. You can also inject custom readiness information into the condition data for a Pod, if that is useful to your application.
4. Pods are only scheduled once in their lifetime. Once a Pod is scheduled (assigned) to a Node, the Pod runs on that Node until it stops or is terminated.


## Pod lifetime
1. Like individual application containers, Pods are considered to be relatively ephemeral (rather than durable) entities. 
2. Pods are created, assigned a unique ID (UID), and scheduled to nodes where they remain until termination (according to restart policy) or deletion. 
3. If a Node dies, the Pods scheduled to that node are scheduled for deletion after a timeout period.
4. Pods do not, by themselves, self-heal. If a Pod is scheduled to a node that then fails, the Pod is deleted; likewise, a Pod won't survive an eviction due to a lack of resources or Node maintenance. 
5. Kubernetes uses a higher-level abstraction, called a controller, that handles the work of managing the relatively disposable Pod instances.
6. A given Pod (as defined by a UID) is never "rescheduled" to a different node; instead, that Pod can be replaced by a new, near-identical Pod, with even the same name if desired, but with a different UID.
7. When something is said to have the same lifetime as a Pod, such as a volume, that means that the thing exists as long as that specific Pod (with that exact UID) exists. If that Pod is deleted for any reason, and even if an identical replacement is created, the related thing (a volume, in this example) is also destroyed and created anew.


## Pod phase
1. A Pod's status field is a PodStatus object, which has a `phase` field.
2. The number and meanings of Pod phase values are tightly guarded. Other than what is documented here, nothing should be assumed about Pods that have a given phase value.
3. Here are the possible values for phase
    * `Pending`: The Pod has been accepted by the Kubernetes cluster, but one or more of the containers has not been set up and made ready to run. This includes time a Pod spends waiting to be scheduled as well as the time spent downloading container images over the network.
    * `Running`: The Pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting.
    * `Succeeded`: All containers in the Pod have terminated in success, and will not be restarted.
    * `Failed`: All containers in the Pod have terminated, and at least one container has terminated in failure. That is, the container either exited with non-zero status or was terminated by the system.
    * `Unknown`: For some reason the state of the Pod could not be obtained. This phase typically occurs due to an error in communicating with the node where the Pod should be running.
4. If a node dies or is disconnected from the rest of the cluster, Kubernetes applies a policy for setting the phase of all Pods on the lost node to `Failed`.
5. When a Pod is being deleted, it is shown as `Terminating` by some kubectl commands. This `Terminating` status is not one of the Pod phases. A Pod is granted a term to terminate gracefully, which defaults to 30 seconds.


## Container states
1. As well as the phase of the Pod overall, Kubernetes tracks the state of each container inside a Pod.
2. Once the scheduler assigns a Pod to a Node, the kubelet starts creating containers for that Pod using a container runtime. 
3. There are three possible container states: `Waiting`, `Running`, and `Terminated`.

### Waiting
1. If a container is not in either the `Running` or `Terminated` state, it is `Waiting`. 
2. A container in the `Waiting` state is still running the operations it requires in order to complete start up: for example, pulling the container image from a container image registry, or applying Secret data. 
3. When you use `kubectl` to query a Pod with a container that is `Waiting`, you also see a `Reason` field to summarize why the container is in that state.

### Running 
1. The `Running` status indicates that a container is executing without issues. 
2. When you use `kubectl` to query a Pod with a container that is `Running`, you also see information about when the container entered the `Running` state.

### Terminated
1. A container in the `Terminated` state began execution and then either ran to completion or failed for some reason. 
2. When you use `kubectl` to query a Pod with a container that is `Terminated`, you see a reason, an exit code, and the start and finish time for that container's period of execution.


## Container restart policy
1. The `spec` of a Pod has a `restartPolicy` field with possible values `Always`, `OnFailure`, and `Never`. The default value is `Always`.
2. The `restartPolicy` applies to all containers in the Pod. `restartPolicy` only refers to restarts of the containers by the kubelet on the same node. 
3. After containers in a Pod exit, the kubelet restarts them with an exponential back-off delay (10s, 20s, 40s, …), that is capped at five minutes. 
4. Once a container has executed for 10 minutes without any problems, the kubelet resets the restart backoff timer for that container.


## References
* [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)