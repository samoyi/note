# Jobs


<!-- TOC -->

- [Jobs](#jobs)
    - [Summary](#summary)
    - [Writing a Job spec](#writing-a-job-spec)
        - [Pod Template](#pod-template)
    - [Handling Pod and container failures](#handling-pod-and-container-failures)
        - [Pod backoff failure policy](#pod-backoff-failure-policy)
    - [Job termination and cleanup](#job-termination-and-cleanup)
    - [References](#references)

<!-- /TOC -->


## Summary
1. A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate. 
2. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete.
3. Deleting a Job will clean up the Pods it created. 
4. Suspending a Job will delete its active Pods until the Job is resumed again.
5. A simple case is to create one Job object in order to reliably run one Pod to completion. The Job object will start a new Pod if the first Pod fails or is deleted (for example due to a node hardware failure or a node reboot).
6. You can also use a Job to run multiple Pods in parallel.
7. Here is an example Job config. It computes π to 2000 places and prints it out
    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      name: pi
    spec:
      template:
        spec:
          containers:
          - name: pi
            image: perl:5.34.0
            command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
          restartPolicy: Never
      backoffLimit: 4
    ```


## Writing a Job spec
As with all other Kubernetes config, a Job needs `apiVersion`, `kind`, and `metadata` fields. A Job also needs a `.spec` section.

### Pod Template
1. The `.spec.template` is the only required field of the `.spec`.
2. The `.spec.template` is a pod template. It has exactly the same schema as a Pod, except it is nested and does not have an `apiVersion` or `kind`.
3. In addition to required fields for a Pod, a pod template in a Job must specify appropriate labels and an appropriate restart policy. Only a `RestartPolicy` equal to `Never` or `OnFailure` is allowed.


## Handling Pod and container failures

### Pod backoff failure policy
1. There are situations where you want to fail a Job after some amount of retries due to a logical error in configuration etc. 
2. To do so, set `.spec.backoffLimit` to specify the number of retries before considering a Job as failed. The back-off limit is set by default to 6. 
3. Failed Pods associated with the Job are recreated by the Job controller with an exponential back-off delay (10s, 20s, 40s ...) capped at six minutes.


## Job termination and cleanup
1. When a Job completes, no more Pods are created, but the Pods are usually not deleted either. 
2. Keeping them around allows you to still view the logs of completed pods to check for errors, warnings, or other diagnostic output. 
3. The job object also remains after it is completed so that you can view its status. It is up to the user to delete old jobs after noting their status.
4. By default, a Job will run uninterrupted unless a Pod fails (`restartPolicy=Never`) or a Container exits in error (`restartPolicy=OnFailure`), at which point the Job defers to the `.spec.backoffLimit` described above. 
5. Once `.spec.backoffLimit` has been reached the Job will be marked as failed and any running Pods will be terminated.
6. Another way to terminate a Job is by setting an active deadline. Do this by setting the `.spec.activeDeadlineSeconds` field of the Job to a number of seconds. 
7. The `activeDeadlineSeconds` applies to the duration of the job, no matter how many Pods are created. 
8. Once a Job reaches `activeDeadlineSeconds`, all of its running Pods are terminated and the Job status will become type: `Failed` with reason: `DeadlineExceeded`.
9. Note that a Job's `.spec.activeDeadlineSeconds` takes precedence over its `.spec.backoffLimit`. Therefore, a Job that is retrying one or more failed Pods will not deploy additional Pods once it reaches the time limit specified by `activeDeadlineSeconds`, even if the `backoffLimit` is not yet reached
    ```yaml
    apiVersion: batch/v1
    kind: Job
    metadata:
      name: pi-with-timeout
    spec:
      backoffLimit: 5
      activeDeadlineSeconds: 100
      template:
        spec:
          containers:
          - name: pi
            image: perl:5.34.0
            command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
          restartPolicy: Never
    ```
10. Keep in mind that the `restartPolicy` applies to the Pod, and not to the Job itself: there is no automatic Job restart once the Job status is type: Failed. That is, the Job termination mechanisms activated with `.spec.activeDeadlineSeconds` and `.spec.backoffLimit` result in a permanent Job failure that requires manual intervention to resolve.


## References
* [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/)