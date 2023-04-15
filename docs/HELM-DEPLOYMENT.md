# Deployment Guide

This document explains how to deploy Unguard to your cloud. Currently, this documentation covers only AWS.

## ☸️ AWS Quickstart

This guide assumes that an EKS cluster (and ECR repositories) already exist.

### 🗒️ Prerequisites

* [Helm](https://helm.sh/docs/intro/install/)
* [AWS CLI](https://aws.amazon.com/cli/)

### ⛵ AWS [EKS](https://aws.amazon.com/eks/) Deployment

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
3. Add bitnami repo for the mariadb dependency
    ```sh
    helm repo add bitnami https://charts.bitnami.com/bitnami
    ```

4. Install mariadb
     ```sh
     helm install unguard-mariadb bitnami/mariadb --set primary.persistence.enabled=false --wait --namespace unguard --create-namespace
     ```

5. Deploy to Cluster.

     ```sh
     helm install unguard .././unguard-chart --wait --namespace unguard --create-namespace
     ```
