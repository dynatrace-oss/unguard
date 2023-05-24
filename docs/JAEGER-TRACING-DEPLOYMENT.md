# Jaeger Deployment Guide

This document explains how to deploy Unguard with Jaeger tracing.

1. Add Jaegertracing chart repo
   ```sh
    helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
   ```

## Install Jaeger

1. For local development
    1. Install the Jaeger-Operator
       ```sh
        helm install jaeger-operator jaegertracing/jaeger-operator --version 2.22.0 --wait --namespace unguard --create-namespace
       ```
    2. Deploy the AllInOne image for local development
       ```sh
        kubectl apply -f ./k8s-manifests/jaeger/jaeger.yaml
       ```
2. For production
    1. Install Jaeger
        ```sh
        helm install jaeger jaegertracing/jaeger -f ./chart/jaeger.yaml --wait --namespace unguard --create-namespace
        ```

## Deploy Unguard with tracing and Jaeger enabled to Cluster.

> **Note**:\
> For local deployment append **--set localDev.enabled=true**\
> For AWS deployment append **--set aws.enabled=true**

> **Note**: Replace __version__ with the helm chart version you want to install.

```sh
helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version 0.8.0 --wait --namespace unguard --create-namespace  --set jaeger.enabled=true -f ./chart/tracing.yaml --set [localDev.enabled=true|aws.enabled=true]
```

## 🖥️ Usage

1. Port-forward the Jaeger UI

    ```sh
    kubectl port-forward -n unguard service/jaeger-query 16686:16686
    ```

2. Open [localhost:16686](http://localhost:16686)

   ![Jaeger UI](../images/jaeger-ui.png)

## Uninstall

1. Uninstall unguard, mariadb and jaeger-operator
   ```sh
    helm uninstall unguard -n unguard && helm uninstall unguard-mariadb -n unguard
   ```
2. Uninstall Jaeger
    1. For local development
        ```sh
        helm uninstall jaeger-operator -n unguard
        ```
    2. For production
        ```sh
        helm uninstall jaeger -n unguard
        ```
