# Deployment Guide

This document explains how to deploy Unguard with Jaeger tracing.

1. Add jaeger chart repo
   ```sh
    helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
   ```

2. Install jaeger-operator
   ```sh
    helm install jaeger-operator jaegertracing/jaeger-operator --version 2.22.0 --wait --namespace unguard --create-namespace
   ```

3. Deploy to Minikube-Cluster.

   ```sh
    helm install -f ./chart/localDevMinikube.yaml -f ./chart/jaegerDev.yaml -f ./chart/tracing.yaml unguard ./chart --wait --namespace unguard --create-namespace
   ```


## Uninstall Unguard

1. Uninstall unguard, mariadb and jaeger
   ```sh
    helm uninstall unguard -n unguard && helm uninstall unguard-mariadb -n unguard && helm uninstall jaeger-operator -n unguard
   ```
