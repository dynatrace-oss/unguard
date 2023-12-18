# Unguard Helm Chart

## Introduction

This chart bootstraps an Unguard deployment on a [Kubernetes](https://kubernetes.io) cluster using the [Helm](https://helm.sh)
package manager.

> **Warning** \
> Unguard is **insecure** by design and a careless installation will leave you exposed to severe security vulnerabilities. Make sure to restrict access and/or run it in a sandboxed environment.

## Prerequisites

- [Kubernetes 1.21+](https://kubernetes.io/)
- [Helm 3.8.0+](https://helm.sh/)

## Installing the Chart

> **Note**: This chart presumes an already running MariaDB database in the cluster. The default naming requirement
> is ```unguard-mariadb```.

To install the chart with the release name `unguard` in a new namespace `unguard` with an `unguard-mariadb` MariaDB instance:

1. Add the bitnami repository for the MariaDB dependency

   ```sh
    helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

2. Install MariaDB

    > **Note:** The default release-name of the database installation is ```unguard-mariadb```.
    If you want to change this you also have to adopt the ```mariaDB.serviceName```value.

    ```sh
    helm install unguard-mariadb bitnami/mariadb --set primary.persistence.enabled=false --wait --namespace unguard --create-namespace
    ```

    > **Note:** \
    The `--wait` flag waits for the installation to be completed \
    `--namespace unguard` specifiers the desired namespace \
    `--create-namespace` creates the namespace if it doesn't exist \
    For more details see the [Helm documentation](https://helm.sh/docs/helm/helm_install/)

3. Install Unguard

   > **Note**:\
   The default configuration is for deployment on a local cluster! \
   To deploy to an EKS cluster append: `--set localDev.enabled=false,aws.enabled=true`

    1. Using the **remote chart** from GitHub

       ```sh
       helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --wait --namespace unguard --create-namespace
       ```

    2. Using the **local chart**

        ```sh
        helm install unguard ./chart --wait --namespace unguard --create-namespace
        ```

These commands deploy Unguard in the default configuration.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `unguard` deployment:

```sh
helm uninstall unguard -n unguard
```

To also uninstall the MariaDB deployment:

```sh
helm uninstall unguard-mariadb -n unguard
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Install a specific version of Unguard

To install Unguard in a specific version provide the `--version` flag with the version you want to install:

```sh
helm install unguard  oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version 0.9.1
```

## Parameters

### Global parameters

| Name                             | Description                                                               | Default Value     |
|----------------------------------|---------------------------------------------------------------------------|-------------------|
| `localDev.enabled`               | Creates an Ingress and configures it for local (minikube/kind) deployment | `true`            |
| `aws.enabled`                    | Creates an Ingress and configures it for AWS EKS cluster deployment       | `false`           |
| `tracing.enabled`                | Activates tracing in services                                             | `false`           |
| `maliciousLoadGenerator.enabled` | Deploys the malicious load generator                                      | `false`           |
| `mariaDB.serviceName`            | Expected release-name of the MariaDB installation by Unguard              | `unguard-mariadb` |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

```sh
helm install unguard oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --set mariaDB.serviceName=mariadb
```

The above command changes the MariaDB installation release-name to `mariadb`.

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```sh
helm install unguard -f aws.yaml oci://ghcr.io/dynatrace-oss/unguard/chart/unguard
```

The above command applies the values from `aws.yaml` which creates and configures an ingress for EKS deployment.

> **Tip**: You can use the default [values.yaml](values.yaml)


## Installation on an AWS EKS cluster

> **Warning** \
> Unguard is **insecure** by design and a careless installation will leave you exposed to severe security vulnerabilities. \
> When installing Unguard with the `aws.enabled=true` value set, an ingress gets created. Please make sure to review its configuration.

> **Note**:\
These steps assume that an AWS Load Balancer Controller is installed. See https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.6/ for more information.

This Chart is prepared to install Unguard on an AWS EKS cluster. \
To install Unguard on an AWS EKS cluster running an AWS load balancer, you can run the following `helm` command:

```sh
helm install unguard oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --set localDev.enabled=false,aws.enabled=true
```

This creates an ingress and adds the following default annotations:

```yaml
kubernetes.io/ingress.class: alb
alb.ingress.kubernetes.io/target-type: ip
alb.ingress.kubernetes.io/scheme: internal
alb.ingress.kubernetes.io/load-balancer-name: "unguard-lb"
```

These annotations can be adjusted by modifying and extending the `aws.yaml` values file and then passing it to the Unguard helm install command like shown bellow.

```sh
helm install unguard -f aws.yaml oci://ghcr.io/dynatrace-oss/unguard/chart/unguard
```

> **Note**:\
Passing the `aws.yaml` values file removes and overrides ALL default annotations.


## Tracing and Jaeger

To enable tracing, provide the YAML file [tracing.yaml](tracing.yaml) during installation. **Unguard is configured for Jaeger tracing.** \
To also install Jaeger tracing follow the [TRACING](../docs/TRACING.md#jaeger-installation-guide) guide.

```sh
helm install unguard oci://ghcr.io/dynatrace-oss/unguard/chart/unguard -f ./chart/tracing.yaml
```

## License

Copyright 2023 Dynatrace LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
