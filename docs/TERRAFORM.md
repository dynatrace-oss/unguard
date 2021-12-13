# Terraform Guide

This document explains how to setup the ECR container registry in your AWS EKS cluster with `terraform`.

## 🗒️ Prerequisites

* [AWS CLI](https://aws.amazon.com/cli/)
* [Terraform](https://www.terraform.io/downloads.html)

## 🅰 AWS [ECR](https://aws.amazon.com/ecr/) Setup

1. **Your EKS cluster does not even exist yet within AWS?**  
   Find someone who knows AWS and Terraform and read on in [cia-k8s-infrastructure-creation](https://bitbucket.lab.dynatrace.org/projects/CASP/repos/cia-k8s-infrastructure-creation/browse/creation-k8s-infrastructure) 

2. Pull AWS configuration via [ACE UPM](https://internal.ace-tools.dynatrace.com/upm/me/dashboard) (see [here](https://dev-wiki.dynatrace.org/x/wx6jF) for your first-time setup)

3. Create the ECR repositories

   ```sh
   terraform -chdir=infrastructure init
   terraform -chdir=infrastructure apply -auto-approve
   ```

4. 🎉 You may confirm this by logging into the AWS console (see step 2) and checking if you see ECR repositories
