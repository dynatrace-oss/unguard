# status-service
Fetch the kubernetes API to expose deployment information about a specific namespace via the following endpoints:
> GET status-service/deployments

Returns an map of deployment names with it's details, for more information on the deployment details visit the [kubernetes API docs, deployment v1 apps](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#deployment-v1-apps)

> GET status-service/deployments/health

start a minikube k8s cluster and deploy unguard into minikube with skaffold (also shortly explain how to do that)
run it locally

## How to Run
* Locally (convenient for development)
* Directly into minikube using skaffold (instructions in general README.md)

### Local Development
To avoid image building and deployment to minikube overhead, you could also run the server locally for a little development speed boost.

### Prerequisites

* [Have GO installed locally](https://go.dev/doc/install)
* Setup IntelliJ
   * [Install Go Plugin](https://www.jetbrains.com/help/idea/go-plugin.html)
   * [Configure GO_ROOT and GO_PATH](https://www.jetbrains.com/help/idea/configuring-goroot-and-gopath.html#goroot)
   * Enable GO Modules integration: in Settings navigate to Language & Frameworks > Go > Go Modules and tick the checkbox "Enable Go modules integration" 

### Switch Kubernetes API connection approach to from outside-cluster
status-service is developed to work inside a pod and connect to the Kubernetes API from within, we need to change our local connection to connect from outside the cluster.

* [Apply the patch to be able to connect from outside the cluster](./connections/k8s-client-out-of-cluster-connection.patch)
  <br>
 **NOTE: adapt your path in the patch in case no homedir is found in your environment**

#### Run the server
```gitexclude
go run server.go
```

access the server via `localhost:8083`

E.g GET `localhost:8083/status-service/deployments`

## Environment Variables 

| Name                   | Example Value          | Description                                  |
|------------------------|------------------------|----------------------------------------------|
| SERVER_PORT            | 8083                   | The port that the server will run on         |
| API_PATH               | /status-service        | Api entrypoint path                          |
| KUBERNETES_NAMESPACE   | unguard                | Namespace to fetch deployments from          |
| IGNORED_DEPLOYMENTS    | unguard-user-simulator | That should be ignored for health assessment |
