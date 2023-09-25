# Status Service

Fetch the kubernetes API to expose deployment information about a specific namespace via the following endpoints:
> GET status-service/deployments

Returns a map of deployment names with its details, for more information on the deployment details visit
the [kubernetes API docs, deployment v1 apps](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#deployment-v1-apps)

> GET status-service/deployments/health

Gets a list of users from the MariaDB database. You can filter by the username using the `name` parameter and by the role(s) using the `roles`/`roles[]` parameter. The parameters are vulnerable to SQL Injection attacks:
> GET status-service/users?name=robot&roles=AD_MANAGER

## How to Run

* Locally (convenient for development)
* Directly into minikube using skaffold (instructions in general README.md)

### Local Development

To avoid image building and deployment to minikube overhead, you could also run the server locally for a little
development speed boost.

### Prerequisites

* [Have GO installed locally](https://go.dev/doc/install)
* Setup IntelliJ
    * [Install Go Plugin](https://www.jetbrains.com/help/idea/go-plugin.html)
    * [Configure GO_ROOT and GO_PATH](https://www.jetbrains.com/help/idea/configuring-goroot-and-gopath.html#goroot)
    * Enable GO Modules integration: in Settings navigate to Language & Frameworks > Go > Go Modules and tick the
      checkbox "Enable Go modules integration"
* A running MariaDB

### Run MariaDB locally
The status-service requires a running relational database MariaDB.
This database needs to be initialized by the user-auth-service. Therefore, before you run the status-service locally,
you need to start the user-auth-service, as described in [the user-auth-service's Readme](../user-auth-service/README.md).
And then update the environment variables for the status-service to fit:
```bash
export MARIADB_PASSWORD=mariadb-root-password
export MARIADB_SERVICE=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' user-auth-db)
```


### Switch Kubernetes API connection approach to from outside-cluster

status-service is developed to work inside a pod and connect to the Kubernetes API from within, we need to change our
local connection to connect from outside the cluster.

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

| Name                 | Example Value          | Description                                  |
|----------------------|------------------------|----------------------------------------------|
| SERVER_PORT          | 8083                   | The port that the server will run on         |
| API_PATH             | /status-service        | Api entrypoint path                          |
| KUBERNETES_NAMESPACE | unguard                | Namespace to fetch deployments from          |
| IGNORED_DEPLOYMENTS  | unguard-user-simulator | That should be ignored for health assessment |
| MARIADB_SERVICE      | localhost              | Address of MariaDB database                  |
| MARIADB_PASSWORD     | mariadb-root-password  | Password of MariaDB database                 |
