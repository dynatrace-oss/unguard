# ![Vogelgrippe logo](images/vogelgrippe_small.png) Vogelgrippe

A SSRF vulnerable twitter-clone consisting of several microservices designed to run on Kubernetes.
It comes with Jaeger traces and a bunch of vulnerabilities built-in.

It allows users to

- register / login (without any passwords)
- post text
- post URLs with URL preview
- view global or personalized timelines
- view user profiles
- follow other users

## 🏗️ Architecture

Vogelgrippe consists of four main services, a load generator, two databases, and Jaeger for tracing:

| Service                                  | Language        | Description                                                                                                  |
| ---------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| [frontend](./frontend)                   | Node.js Express | Serves HTML to the user to interact with the application                                                     |
| [microblog-service](./microblog-service) | Java Spring     | Serves REST API for frontend, saves data into redis                                                          |
| [proxy-service](./proxy-service)         | Java Spring     | Serves REST API for proxying requests from frontend (vulnerable to SSRF; no sanitization on the entered URL) |
| [user-auth-service](./user-auth-service) | Node.js Express | Serves REST API for authenticating users with JWT tokens (vulnerable to JWT key confusion)                   |
| [loadgenerator](./loadgenerator)         | Python Locust   | Creates synthetic user traffic                                                                               |
| redis                                    |                 | Key-value store that holds all user data (except authentication-related stuff)                               |
| maria-db                                 |                 | Relational database that holds user and token data                                                           |
| jaeger                                   |                 | The [Jaeger](https://www.jaegertracing.io/) stack for distributed tracing                                    |

![Vogelgrippe Architecture](images/architecture_vogelgrippe.png)

## ⛵ Kubernetes Deployment

This is the recommended way of running Vogelgrippe and requires you to have [minikube](https://minikube.sigs.k8s.io/docs/) installed.

1.  **Install prerequisites**

    Follow the instructions to install the following on your system:

    * [minikube](https://minikube.sigs.k8s.io/docs/start/) or [kind](https://kind.sigs.k8s.io/)
    * [kubectl](https://kubernetes.io/docs/tasks/tools/)
    * [helm](https://helm.sh/docs/intro/install/)
    * [skaffold](https://skaffold.dev/docs/install/)

    Add the necessary helm repositories and fetch updates:

    ```
    helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update
    ```

2.  **Start a new or existing minikube cluster with the ingress add-on enabled**

    This will create a new minikube profile (i.e. cluster) named "vogelgrippe".

    ```
    minikube start --addons=ingress --profile vogelgrippe
    ```

    Alternatively, create a new kind cluster named "vogelgrippe".

    ```
    kind create cluster --name vogelgrippe
    ```

3.  **Install [Jaeger](https://www.jaegertracing.io/)**

    First, add the Jaeger operator to the cluster

    ```
    helm install jaeger-operator jaegertracing/jaeger-operator
    ```

    Next, apply it to your running cluster.
    We do this manually to avoid having skaffold attempt to redeploy Jaeger every time.

    ```
    kubectl apply -f k8s-manifests/extra/jaeger.yaml
    ```

    > Note: Make sure to name your Jaeger instance `jaeger` or
    > adjust all the `JAEGER_AGENT_HOST` environment variables in
    > `/k8s-manifests` to be of format `{YOUR-NAME}-agent`

4.  **(Optionally) Add image pull secrets to your cluster service accounts**

    Due to the great number of image pulls required you might need to set secrets for
    an authenticated image repository to avoid being [rate-limited by DockerHub](https://www.docker.com/increase-rate-limits).

    ```
    kubectl create secret docker-registry vogelgrippe-docker-hub-secrets
        --docker-server=docker.io \
        --docker-username=DUMMY_USERNAME \
        --docker-password=DUMMY_DOCKER_ACCESS_TOKEN \
        --docker-email=DUMMY_DOCKER_EMAIL
    ```

    Patch the default service account (and the one used by the Jaeger operator) to use these pull secrets.

    On Linux, use the following

    ```
    kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "vogelgrippe-docker-hub-secrets"}]}'
    kubectl patch serviceaccount jaeger-operator -p '{"imagePullSecrets": [{"name": "vogelgrippe-docker-hub-secrets"}]}'
    ```

    On Windows, use the following

    ```
    kubectl patch serviceaccount default -p '{\"imagePullSecrets\": [{\"name\": \"vogelgrippe-docker-hub-secrets\"}]}'
    kubectl patch serviceaccount jaeger-operator -p '{\"imagePullSecrets\": [{\"name\": \"vogelgrippe-docker-hub-secrets\"}]}'
    ```

    > Note: This needs to be done every time you re-create the cluster.
    > You might need to repeat those steps once you deploy additional charts,
    > e.g. for `jaeger`, `jaeger-operator`, `mariadb-release` at the moment.

5.  **Build and run the Vogelgrippe application with [Skaffold](https://skaffold.dev/)**

    We grab the docker daemon from the cluster first, so that we push the built images already into the cluster.

    On Linux with minikube, use the following

    ```
    eval $(minikube -p vogelgrippe docker-env)
    skaffold run --detect-minikube
    ```

    On Windows with minikube, use the following with PowerShell

    ```
    & minikube -p vogelgrippe docker-env | Invoke-Expression
    skaffold run --detect-minikube
    ```

    With a kind cluster, simply run the following.
    Built images will be moved to the kind cluster automatically.

    ```
    skaffold run
    ```

6.  **(Optionally) Expose the application to your local machine**

    To access the frontend, you can use port-fowarding.
    This is the recommended way as exposing the service to external traffic would be a bad idea.

    ```
    # exposes the frontend on localhost:3000
    kubectl port-forward service/vogelgrippe-frontend 3000:80
    ```

    To make non-blind SSRF exploits, you can expose the proxy-service as well.
    This would be common practice with applications where the browser makes the requests (like Angular / React / Vue etc.).

    ```
    # exposes the proxy-service on localhost:8081
    kubectl port-forward service/vogelgrippe-proxy-service 8081:80
    ```

7.  **(Optionally) Expose the application to the internet**

    Use the [`k8s-manifests/extra/ingress.yaml`](./k8s-manifests/extra/ingress.yaml) as a template
    and possibly change the `vogelgrippe.kube` hostname to match the hostname of your deployment before applying it.

    ```
    kubectl apply -f k8s-manifests/extra/ingress.yaml
    ```

    Finally, you have to forward incoming requests to your machine on port 80 to your minikube on port 80.
    One way to do this is with the help of `socat` that you can start in a background `tmux` sessions.
    Make sure that your local firewall also allows connections on port 80, if you have one.

    ```
    sudo socat TCP-LISTEN:80,fork TCP:$(minikube ip):80
    ```

    > Note: This will not expose the proxy-service.

## 🖥️ Local Deployment

A local deployment is not recommended because our services rely on the K8S domain name service.

### Install [Jaeger](https://www.jaegertracing.io/)

Beside the microservices, a Jaeger deployment is recommended as all the services send traces.

For setting up Jaeger, please see their [documentation](https://www.jaegertracing.io/docs/1.20/getting-started/).
The simplest way to start all needed Jaeger components is with Docker:

```
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 14250:14250 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.20
```

### Install the microservices

Follow instructions in the READMEs of the individual services to run them locally.

- [frontend](./frontend)
- [microblog-service](./microblog-service)
- [proxy-service](./proxy-service)
- [user-auth-service](./user-auth-service)
- [loadgenerator](./loadgenerator)
