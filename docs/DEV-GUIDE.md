# Development Guide

This document explains how to build and run Unguard locally inside Kubernetes using `skaffold`.

> **Warning:** Most of the services rely on the Kubernetes DNS. If you must deploy some parts of the application without a Kubernetes cluster, read the READMEs of the individual services instead.

## 🗒️ Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/), [Skaffold](https://skaffold.dev/docs/install/), and [Kustomize](https://kubernetes-sigs.github.io/kustomize/installation/)
* [Kind](https://kind.sigs.k8s.io/), or, alternatively [Minikube](https://minikube.sigs.k8s.io)
  * For best performance and stability, we recommend Kind, especially on Windows

## ⛵ Local Cluster

### 🅰 First-Time Cluster Setup

1. Launch a local Kubernetes cluster

    - Launch a `kind` cluster with [extraPortMappings](https://kind.sigs.k8s.io/docs/user/configuration/#extra-port-mappings) for the local ingress

        ```sh
        kind create cluster --name unguard --config ./k8s-manifests/localdev/kind/cluster-config.yaml
        ```

    - Or, launch a `minikube` cluster with the ingress addon

        ```sh
        minikube start --addons=ingress --profile unguard

        # on 🍎 macOS a vm-based driver is needed
        # https://github.com/kubernetes/minikube/issues/7332
        minikube start --addons=ingress --profile unguard --vm=true
        ```

2. Run `kubectl get nodes` to verify the connection to the respective control plane

3. If you use `minikube`, always forward the Docker daemon in your current shell before running `skaffold`

    ```sh
    # on 🐧 Linux
    eval $(minikube -p unguard docker-env)

    # on 🍎 macOS
    source <(minikube docker-env -p unguard)

    # on 💻 Windows with PowerShell
    & minikube -p unguard docker-env | Invoke-Expression
    ```

### 🅱 Application Deployment

1. Use `skaffold` to build and deploy the application.
   The first full build will take up to 20 minutes.  
   If the images should be rebuilt automatically, run `skaffold dev`.

    - Deploy with **kind**, where the images will be moved automatically into the cluster

        ```sh
        skaffold run -p localdev-kind
        ```

    - Or, deploy with **minikube** and don't forget to forward the Docker daemon first (see above)

        ```sh
        skaffold run -p localdev-minikube --detect-minikube
        ```

2. Add an entry in your `/etc/hosts` file to access the ingress exposing the frontend on **[unguard.kube](http://unguard.kube/)**
    
   - For **kind** clusters, append this to `/etc/hosts`:

   ```
    127.0.0.1 unguard.kube
    ```

   - For **minikube** clusters, execute this in your shell or  
     manually add the output of `minikube -p unguard ip` to your `/etc/hosts` file
     
    ```sh
    sudo -- sh -c "echo $(minikube -p unguard ip) unguard.kube >> /etc/hosts"
    ```

### 🔥 Cleanup

Run `skaffold delete` with the chosen profile used to start unguard to clean up the deployed resources.

```sh
skaffold delete -p {localdev-minikube|localdev-kind}
```

## 🙋‍♀️ FAQ

### What are skaffold profiles?

Have a look at the profiles that are supported in `skaffold.yaml`.  
Often, you might also want to also deploy Jaeger or even Falco.

```sh
skaffold run -p localdev-kind,jaeger-dev,falco
```

### How can I have fast, incremental Java builds during development?

To benefit from incremental Java builds in the container, install [OpenJDK 11](https://openjdk.java.net/projects/jdk/11/) and [Jib](https://github.com/GoogleContainerTools/jib).

You may then append the `jib` profile which adapts the build section so that it uses your locally installed Jib.
```sh
skaffold run -p localdev-minikube,jib
```

### How can I switch between multiple clusters?

Clusters are configured in `~/.kube/config`.

To switch between different clusters (e.g., between `aws` and `kind`) set the `current-context:` to a cluster saved in the `contexts:` section.

A great tool that makes this process faster is [kubectx](https://github.com/ahmetb/kubectx).

### Is there more?

Maybe you find something in the other [FAQ](FAQ.md) document.
