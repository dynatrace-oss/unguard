# Unguard Helm Chart

## Introduction

This chart bootstraps a Unguard deployment on a [Kubernetes](https://kubernetes.io) cluster using the [Helm](https://helm.sh)
package manager.

## Prerequisites

- Helm 3.8.0+

## Installing the Chart

To install the chart with the release name `my-release`:
> **Note**: This chart presumes an already running and configured mariaDB database in the cluster

```console
helm install my-release oci://ghcr.io/dynatrace-oss/unguard/chart/unguard
```

These commands deploy Unguard in the default configuration.

> **Tip**: List all releases using `helm list`

## Uninstalling the Chart

To uninstall/delete the `my-release` deployment:

```console
helm delete my-release
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Parameters

### Global parameters

| Name                             | Description                                     | Default Value |
|----------------------------------|-------------------------------------------------|---------------|
| `localDev.enabled`               | Enable for local (minikube/kind) deployment     | `false`       |
| `aws.enabled`                    | Enable for AWS cluster deployment               | `false`       |
| `tracing.enabled`                | Enable to activate tracing                      | `false`       |
| `jaeger.enabled`                 | Enable to activate jaeger                       | `false`       |
| `maliciousLoadGenerator.enabled` | Enable to activate the malicious load generator | `false`       |

Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example,

```console
helm install my-release \
  --localDev.enabled=true \
    my-release oci://ghcr.io/dynatrace-oss/unguard/chart/unguard
```

The above command sets `localDev.enabled` to `true`. Which creates and configures an ingress for local deployment.

Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example,

```console
helm install my-release -f values.yaml oci://ghcr.io/dynatrace-oss/unguard/chart/unguard
```

> **Tip**: You can use the default [values.yaml](values.yaml)


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
