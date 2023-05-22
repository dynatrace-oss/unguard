# Jaeger-dev Deployment Guide

This document explains how to deploy Unguard with Jaeger tracing.

1. Add jaeger chart repo
   ```sh
    helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
   ```

## Install jaeger-dev

1. Install jaeger-operator
   ```sh
    helm install jaeger-operator jaegertracing/jaeger-operator --version 2.22.0 --wait --namespace unguard --create-namespace
   ```
2. Deploy the AllInOne image for local development
   ```sh
    kubectl apply -f ./k8s-manifests/jaeger/jaeger.yaml
   ```

3. Deploy to Minikube/Kind-Cluster.

   ```sh
    helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version 0.8.0 --set localDev.enabled=true  --set jaeger.enabled=true -f ./chart/tracing.yaml --wait --namespace unguard --create-namespace
   ```

### Uninstall Jaeger-dev

1. Uninstall unguard, mariadb and jaeger-operator
   ```sh
    helm uninstall unguard -n unguard && helm uninstall unguard-mariadb -n unguard && helm uninstall jaeger-operator -n unguard
   ```

## Install jaeger

1. Install jaeger
   ```sh
    helm install jaeger jaegertracing/jaeger -f ./chart/jaeger.yaml --wait --namespace unguard --create-namespace
   ```

2. Uninstall unguard, mariadb and jaeger
   ```sh
    helm uninstall unguard -n unguard && helm uninstall unguard-mariadb -n unguard && helm uninstall jaeger -n unguard
   ```

### Uninstall Jaeger
