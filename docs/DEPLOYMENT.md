# Deployment Guide

This document explains how to deploy Unguard to your cloud. Currently, this documentation covers only AWS.

## ☸️ AWS Quickstart

This guide assumes that an EKS cluster (and ECR repositories) already exist.  
If they don't, head to the [Terraform Guide](./TERRAFORM.md) for more.

### 🗒️ Prerequisites

* [Docker](https://www.docker.com/products/docker-desktop)
* [Kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/), [Skaffold](https://skaffold.dev/docs/install/), and [Kustomize](https://kubernetes-sigs.github.io/kustomize/installation/)
* [AWS CLI](https://aws.amazon.com/cli/)

### ⛵ AWS [EKS](https://aws.amazon.com/eks/) Deployment

1. Pull AWS configuration via [ACE UPM](https://internal.ace-tools.dynatrace.com/upm/me/dashboard) (see [here](https://dev-wiki.dynatrace.org/x/wx6jF) for your first-time setup).

2. Let `aws` update your kubeconfig to be connected to EKS.
   This command will also return you the account ID that you need in the next step.
   It is encoded in the ARN ` arn:aws:eks:${REGION}:${AWS_ACCOUNT_ID}:cluster/${CLUSTER_NAME}`.

   ```sh
   aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}
   ```

3. Let `aws` log you into your ECR repository so that Docker pushes images to that.

   ```sh
   aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
   ```

4. Deploy to AWS. This might take up to 30 minutes for a cold build.

   ```sh
   # do a standard deployment
   skaffold run -p aws --default-repo ${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com

   # for extra services add the corresponding profile
   skaffold run -p aws,falco,jaeger --default-repo ${AWS_ACCOUNT_ID}.ecr.${REGION}.amazonaws.com
   ```

5. (Optional) Configure AWS Route 53 DNS entry. This is only necessary if the load balancer has been removed and recreated and is done through the UI. Within the AWS Console, follow these steps:
    * Go to the Route 53 console.
    * Open the hosted zone that you want to configure.
    * Edit the existing entry or create a new entry with:
        * Record Name: _choose a name_
        * Route traffic to: "Alias to Application and Classic Load Balancer"
        * Region: ${REGION}
        * Load Balancer: _select the AWS load balancer of unguard_