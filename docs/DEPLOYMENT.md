# Deployment Guide

This document explains how to deploy Unguard to your cloud. This can be either a local Minikube/Kind or AWS Cluster.

## ☸️ AWS/Minikube Quickstart

This guide assumes that an EKS (and ECR repositories) or a Minikube-Cluster already exist.
> **Note**: Follow the [Development Guide](DEV-GUIDE.md) to set up a local cluster

## Preparation

### 🅰 AWS [EKS](https://aws.amazon.com/eks/) Deployment

#### 🗒️ Prerequisites

* [Helm](https://helm.sh/docs/intro/install/)
* [AWS CLI](https://aws.amazon.com/cli/)

1. Let `aws` update your kubeconfig to be connected to EKS.
   This command will also return you the account ID that you need in the next step.
   It is encoded in the ARN `arn:aws:eks:${REGION}:${AWS_ACCOUNT_ID}:cluster/${CLUSTER_NAME}`.

   ```sh
   aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}
   ```

2. Let `aws` log you into your ECR repository so that Docker pushes images to that.

   ```sh
   aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
   ```

3. Follow the [Helm-Deployment Guide](#HELM-Deployment)

### 🅱 Local Deployment

#### 🗒️ Prerequisites

* [Helm](https://helm.sh/docs/intro/install/)
* [Minikube](https://minikube.sigs.k8s.io)
* [Kind](https://kind.sigs.k8s.io/)

1. Follow the [Development Guide](DEV-GUIDE.md) to set up a local Cluster

2. Follow the [Helm-Deployment Guide](#HELM-Deployment)

## [HELM](https://helm.sh/) Deployment

1. Add bitnami repo for the MariaDB dependency
   ```sh
    helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

2. Install MariaDB
   ```sh
   helm install unguard-mariadb bitnami/mariadb --set primary.persistence.enabled=false --wait --namespace unguard --create-namespace
   ```

3. Deploy to Cluster.
    > **Note**: For deployment with Jaeger and tracing enabled follow the [JAEGER-TRACING-Deployment Guide](./JAEGER-TRACING-DEPLOYMENT.md)

    > **Note**:\
    For local deployment append **--set localDev.enabled=true**\
    For AWS deployment append **--set aws.enabled=true**

    1. Using the **remote chart** from GitHub.
       > **Note**: Replace __version__ with the helm chart version you want to install.
       ```sh
       helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version 0.8.0 --wait --namespace unguard --create-namespace --set [localDev.enabled=true|aws.enabled=true]
       ```

    2. Using the **local chart**.
        ```sh
        helm install unguard ./chart --wait --namespace unguard --create-namespace --set [localDev.enabled=true|aws.enabled=true]
        ```

## Uninstall Unguard

To uninstall Unguard and MariaDB chart:
```sh
helm uninstall unguard -n unguard && helm uninstall unguard-mariadb -n unguard
```
