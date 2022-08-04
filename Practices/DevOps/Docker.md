# Docker


<!-- TOC -->

- [Docker](#docker)
    - [Summary](#summary)
    - [Key concepts](#key-concepts)
        - [Docker Engine](#docker-engine)
        - [Docker Daemon](#docker-daemon)
        - [Docker Client](#docker-client)
        - [Docker Image](#docker-image)
        - [Docker Container](#docker-container)
        - [Docker Registry](#docker-registry)
        - [Container Orchestration](#container-orchestration)
    - [Docker Image](#docker-image-1)
    - [References](#references)

<!-- /TOC -->


## Summary
1. Docker is a tool that allows developers, sys-admins etc. to easily deploy their applications in a sandbox (called containers) to run on the host operating system i.e. Linux. 
2. The key benefit of Docker is that it allows users to package an application with all of its dependencies into a standardized unit for software development. 


## Key concepts
### Docker Engine
1. This is the application you install on your host machine to build, run, and manage Docker containers. 
2. As the core of the Docker system, it unites all of the platform’s components in a single location.


### Docker Daemon
The workhorse of the Docker system, this component listens to and processes API requests to manage the various other aspects of your installation, such as images, containers, and storage volumes.

### Docker Client
This is the primary user interface for communicating with the Docker system. It accepts commands via the command-line interface (CLI) and sends them to the Docker daemon.

### Docker Image
1. A read-only **template** used for creating Docker containers. 
2. It consists of a series of layers that constitute an all-in-one package, which has all of the installations, dependencies, libraries, processes, and application code necessary to create a fully operational container environment.

### Docker Container
1. A living instance of a Docker image that runs an individual microservice or full application stack. 
2. When you launch a container, you add a top writable layer, known as a container layer, to the underlying layers of your Docker image. 
3. This is used to store any changes made to the container throughout its runtime.

### Docker Registry
1. A cataloging system for hosting, pushing, and pulling Docker images. 
2. You can use your own local registry or one of the many registry services hosted by third parties. 
3. A Docker registry organizes images into storage locations, known as repositories, where each repository contains different versions of a Docker image that share the same image name.

### Container Orchestration
1. Once you’re ready to deploy an application to Docker, you’ll need a way to provision, configure, scale, and monitor your containers across your microservice architecture. 
2. Open-source orchestration systems, such as Kubernetes, Mesos, and Docker Swarm, can provide you with the tools you’ll need to manage your container clusters.


## Docker Image
A Docker image is made up of a collection of files that bundle together all the essentials – such as installations, application code, and dependencies – required to configure a fully operational container environment.


## References
* [THE BASICS: A Beginner’s Guide to Docker](https://jfrog.com/knowledge-base/the-basics-a-beginners-guide-to-docker/)