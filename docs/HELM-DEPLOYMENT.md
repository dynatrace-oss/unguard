# Deployment Guide

This document explains how to deploy Unguard to your cloud. This can be either a local Minikube-Cluster or AWS.

## ☸️ AWS/Minikube Quickstart

This guide assumes that an EKS (and ECR repositories) or a Minikube-Cluster already exist.

### 🗒️ Prerequisites

* [Helm](https://helm.sh/docs/intro/install/)
* [Minikube](https://minikube.sigs.k8s.io)
* [AWS CLI](https://aws.amazon.com/cli/)

### 🅰 AWS [EKS](https://aws.amazon.com/eks/) Deployment

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
3. Add bitnami repo for the Mariadb dependency
   ```sh
    helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

4. Install mariadb
   ```sh
     helm install unguard-mariadb bitnami/mariadb --set primary.persistence.enabled=false --wait --namespace unguard --create-namespace
   ```

5. Deploy to Cluster.

   ```sh
     helm install -f ./chart/aws.yaml unguard ./chart --wait --namespace unguard --create-namespace
   ```

### 🅱 [Minikube](https://minikube.sigs.k8s.io) Deployment

1. Follow the [Development Guide](./DEV-GUIDE.md) to set up a local Minikube-Cluster

2. Add bitnami repo for the Mariadb dependency
   ```sh
    helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

3. Install Mariadb
   ```sh
     helm install unguard-mariadb bitnami/mariadb --set primary.persistence.enabled=false --wait --namespace unguard --create-namespace
   ```

4. (Optional) Install Jaeger
   * See [JAEGER-DEPLOYMENT](./JAEGER-HELM-DEPLOYMENT.md)

5. Deploy to Minikube-Cluster.

    1. Using the local chart.
   ```sh
     helm install unguard ./chart --set localDev.enabled=true --wait --namespace unguard --create-namespace
   ```
   2. Pulling the remote chart from GitHub.
      Replace __version__ with the helm chart version you want to install.
   ```sh
     helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version 0.8.0 --set localDev.enabled=true --wait --namespace unguard --create-namespace
   ```


## Uninstall Unguard

1. Uninstall Unguard and mariadb chart
   ```sh
    helm uninstall unguard -n unguard && helm uninstall unguard-mariadb -n unguard
   ```


