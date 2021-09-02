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
   * if you're using kind, make sure to deploy the right ingress-nginx resource:
     ```sh
       kubectl apply -f .\docs\dev-env\kind\ingress-nginx.yaml
     ```
     Note: The current ingress resources are incompatible with v1.0.0

## ⛵ Local Cluster

1. Launch a local Kubernetes cluster with one of the following tools:

    - To launch **Minikube** (cluster in a VM and slow on Windows):
        ```sh
          minikube start --addons=ingress --profile unguard
          # 🍎 for macOS a vm-based driver is needed (https://github.com/kubernetes/minikube/issues/7332)
          minikube start --addons=ingress --profile unguard --vm=true
        ```    

    - To launch a **Kind** cluster, make sure to create the cluster with [extraPortMappings](https://kind.sigs.k8s.io/docs/user/configuration/#extra-port-mappings).
      This will be achieved by forwarding the ingress resource to port 82 with the given config:
        ```sh
          kind create cluster --name unguard --config .\docs\dev-env\kind\port-mapping-config.yaml
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

    #### Deployment via ingress
    For local development you can use the skaffold profile localdev 

    ```sh
     skaffold run -p localdev
    ```    
    This will apply the local Ingress resource and expose the frontend and the ad-service to the host `unguard.kube`.
    To excess the resources, make sure to map `unguard.kube` to your localhost via your hosts file:
    ```shell
      # unguard local deployment
      127.0.0.1 unguard.kube
    ```
    Afterwards you can access the page like via
    ``` http://unguard.kube:82/ui/ ```

    #### Deployment via port forwarding
    If you don't want to use the Ingress Controller, you can also use port forwarding to access the frontend and the ad-service.
    When using this method, the ads at the timeline won't show up since they are using the 
    frontend url and there is no ingress in place for the right forwarding. 
    ```sh
     # exposes the frontend on localhost:3000
     kubectl port-forward -n unguard service/unguard-frontend 3000:80
    ```

    To make non-blind SSRF exploits, you can expose the proxy-service as well.
    This would be common practice with applications where the browser makes the requests (like Angular/React/Vue etc.).

    ```sh
     # exposes the proxy-service on localhost:8081
     kubectl port-forward -n unguard service/unguard-proxy-service 8081:80
    ```

    ### switching between clusters
    The **Kind** cluster use `~/.kube/config` for defining context. 
    There you will find current saved context and are able to switch between different clusters
    (e.g. between aws and local kind cluster) by setting the `current-context:` to a cluster saved in the `contexts:` section.

## 🔥 Cleanup

Run `skaffold delete` to clean up the deployed resources.