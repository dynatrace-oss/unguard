# ![Unguard Logo](docs/images/unguard-logo.png) Unguard

**Unguard** (🇦🇹 [ˈʊnˌɡuːat] like disquieting, 🇫🇷 [ãˈɡard] like the fencing command) is an insecure cloud-native microservices demo application. It consists of six app services, a load generator, and two databases. Unguard encompasses vulnerabilities like SSRF and comes with built-in Jaeger traces. The application is a web-based Twitter clone where users can:

- register/login (without any passwords)
- post text and URLs with previews
- view global or personalized timelines
- see ads on the timeline (currently only a static image)
- view user profiles
- follow other users

## 🖼️ Screenshots

| Timeline | User profile |
| -------- | ------------ |
| [![Screenshot of the timeline](./docs/images/unguard-timeline.png)](./docs/images/unguard-timeline.png) | [![Screenshot of a user profile](./docs/images/unguard-user-profile.png)](./docs/images/unguard-user-profile.png) |

## 🏗️ Architecture

Unguard is composed of six microservices written in different languages that talk to each other over REST.

![Unguard Architecture](docs/images/unguard-architecture.png)

| Service                                      | Language        | Service Account | Description                                                                                                                                 |
| -------------------------------------------- | --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [ad-service](./src/ad-service)               | .NET 5          | default         | Provide CRUD operation for images and serves a HTML page which displays an image like an ad.                                                |
| [frontend](./src/frontend)                   | Node.js Express | default         | Serves HTML to the user to interact with the application.                                                                                   |
| [user-simulator](./src/user-simulator)       | Node.js Element | default         | Creates synthetic user traffic by simulating an Unguard user using a real browser. Acts as a load generator.                                |
| [microblog-service](./src/microblog-service) | Java Spring     | default         | Serves a REST API for the frontend and saves data into redis (explicitly calls vulnerable functions of the jackson-databind library 2.9.9). |
| [proxy-service](./src/proxy-service)         | Java Spring     | unguard-proxy   | Serves REST API for proxying requests from frontend (vulnerable to SSRF; no sanitization on the entered URL).                               |
| [user-auth-service](./src/user-auth-service) | Node.js Express | default         | Serves REST API for authenticating users with JWT tokens (vulnerable to JWT key confusion).                                                 |
| jaeger                                       |                 | default         | The [Jaeger](https://www.jaegertracing.io/) stack for distributed tracing.                                                                  |
| mariadb                                      |                 | unguard-mariadb | Relational database that holds user and token data.                                                                                         |
| redis                                        |                 | default         | Key-value store that holds all user data (except authentication-related stuff).                                                             |


| Service Account  | Permissions         |
| ---------------- |---------------------|
| default          | None                |                                               
| unguard-proxy    | List and create pods| 

## 🖥️ Local Deployment

See the [Development Guide](./docs/DEV-GUIDE.md) on how to develop Unguard on a local K8S cluster.

## ☁️ Cloud Deployment

See the [Deployment Guide](./docs/DEPLOYMENT.md) on how to deploy Unguard to your cloud. Currently, the documentation only covers AWS.

## 💫 Versioning

See [this wiki page](https://dev-wiki.dynatrace.org/x/QZRhF).

## ✨ Features

* **[Kubernetes](https://kubernetes.io/) / [AWS](https://aws.amazon.com/eks)**: The app is designed to run on a local Kubernetes cluster, as well as on the cloud with AWS.
* [**Jaeger Tracing**](https://www.jaegertracing.io/): Most services are instrumented using trace interceptors.
* [**Skaffold**](https://skaffold.dev/): Unguard is deployed to Kubernetes with a single command using Skaffold.
* **Synthetic Load Generation**: The application comes with a deployment that creates traffic using the [Element](https://element.flood.io/) browser-based load generation library.
* **[Exploits](./exploits/tool/README.md)**: Different automated attack scenarios like JWT key confusion attacks or remote code execution.

## ➕ Additional Deployment Options

* **Falco**: [See these instructions](./docs/FALCO.md)
* **Jaeger**: [See these instructions](./docs/JAEGER.md)

---

[Hummingbird](https://thenounproject.com/search/?q=hummingbird&i=4138237) icon by Danil Polshin from [the Noun Project](https://thenounproject.com/).