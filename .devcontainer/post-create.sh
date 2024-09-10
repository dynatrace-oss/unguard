#!/bin/bash

# Install
kind create cluster --config .devcontainer/kind-cluster.yml --wait 300s

helm repo add bitnami https://charts.bitnami.com/bitnami

helm install unguard-mariadb bitnami/mariadb --version 11.5.7 --set primary.persistence.enabled=false --wait --namespace unguard --create-namespace

helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --namespace unguard --create-namespace