# Development Guide

This document explains how to build and run Unguard locally inside Kubernetes using `skaffold`.

> **Warning:** Most of the services rely on the Kubernetes DNS. If you must deploy some parts of the application without a Kubernetes cluster, read the READMEs of the individual services instead.

## 🗒️ Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/), [Skaffold](https://skaffold.dev/docs/install/) CLI v2, and [Kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/)
* [Kind](https://kind.sigs.k8s.io/)


### 🅰 First-Time Cluster Setup

1. Launch a local Kubernetes cluster

    * Linux Docker Desktop user need to export the docker socket:
      ```sh
            export DOCKER_HOST="unix:///home/$USER/.docker/desktop/docker.sock"
        ```

   * Launch a `kind` cluster with [extraPortMappings](https://kind.sigs.k8s.io/docs/user/configuration/#extra-port-mappings) for the local ingress

       ```sh
       kind create cluster --name unguard --config ./k8s-manifests/localdev/kind/cluster-config.yaml
       ```


### 🅱 Application Deployment

1. Use `skaffold` to build and deploy the application.
   The first full build will take up to 20 minutes.
   If the images should be rebuilt automatically, run `skaffold dev`.

    * Deploy with **kind**, where the images will be moved automatically into the cluster

        ```sh
        cd ..
        skaffold run -p localdev
        ```

2. Add an entry in your `/etc/hosts` file to access the ingress exposing the frontend on **[unguard.kube](http://unguard.kube/)**

   * For **kind** clusters, append this to `/etc/hosts`:

    ```sh
    127.0.0.1 unguard.kube
    ```

3. Optional add NGINX-Ingress

    * Apply nginx ingress kustomization
      ```sh
             kubectl apply -k ./k8s-manifests/localdev/kind/
        ```


### 🔥 Cleanup

Run `skaffold delete` with the chosen profile used to start unguard to clean up the deployed resources.

```sh
skaffold delete -p localdev-kind
```
