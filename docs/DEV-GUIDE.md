# Development Guide

This document explains how to build and run Unguard locally using `skaffold`. 

> Most of the services rely on the Kubernetes DNS. If you must deploy some parts of the application without a Kubernetes cluster, read the READMEs of the individual services.

## 🗒️ Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [helm](https://helm.sh/docs/intro/install/)
* [skaffold](https://skaffold.dev/docs/install/)
* [kustomize](https://kubernetes-sigs.github.io/kustomize/installation/)
* [OpenJDK11](https://openjdk.java.net/projects/jdk/11/)
* [minikube](https://minikube.sigs.k8s.io) or [kind](https://kind.sigs.k8s.io/)

## ⛵ Local Cluster

1. Launch a local Kubernetes cluster with one of the following tools:

    - To launch **Minikube** (cluster in a VM and slow on Windows):
        ```sh
        minikube start --addons=ingress --profile unguard
        # 🍎 for macOS a vm-based driver is needed (https://github.com/kubernetes/minikube/issues/7332)
        minikube start --addons=ingress --profile unguard --vm=true
        ```    

    - To launch a **Kind** cluster:
        ```sh
        kind create cluster --name unguard
        ```
      
2. Run `kubectl get nodes` to verify the connection to the respective control plane

3. Fetch the necessary Helm repositories

    ```sh
    helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo add falcosecurity https://falcosecurity.github.io/charts # optional
    helm repo update
    ```
   
3. Use `skaffold` to build and deploy the application (first time will be slow). If the images should be rebuilt automatically, run `skaffold dev`.

    - The Docker daemon inside the **Minikube** can be re-used to improve the experience with building and running Docker images:
    ```sh
    # 🐧 for Linux
    eval $(minikube -p unguard docker-env)
    skaffold run --detect-minikube
    # 🍎 for macOS   
    source <(minikube docker-env -p unguard)
    skaffold run --detect-minikube
    # 💻 for Windows (PowerShell)
    & minikube -p unguard docker-env | Invoke-Expression
    skaffold run --detect-minikube
    ```
   
    - With **Kind** the images will be moved automatically to the cluster:
    ```sh
    skaffold run
    ```

4. Access the frontend through your browser

    The recommended way to access the frontend is to use port-forwarding.

    ```sh
    # exposes the frontend on localhost:3000
    kubectl port-forward -n unguard service/unguard-frontend 3000:80
    ```

    Currently, the ad-service has to be exposed to the end-user just like the frontend. For usage in the cloud, an ingress needs to be set up (TODO [CASP-10192](https://dev-jira.dynatrace.org/browse/CASP-10192)).
    ```sh
    kubectl port-forward -n unguard service/unguard-ad-service 8082:80
    ```

    To make non-blind SSRF exploits, you can expose the proxy-service as well.
    This would be common practice with applications where the browser makes the requests (like Angular/React/Vue etc.).

    ```sh
    # exposes the proxy-service on localhost:8081
    kubectl port-forward -n unguard service/unguard-proxy-service 8081:80
    ```

## 🔥 Cleanup

Run `skaffold delete` to clean up the deployed resources.