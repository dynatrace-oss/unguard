# user-simulator

A benign user simulator for Unguard.
Uses a real browser to simulate a user that does various tasks on the defined Unguard instance.

Executes following tasks:
* register / login
* visit frontpage
* visit personal timelines
* post text posts
* post URL posts
* post image posts
* log out

> Note: Currently it only executes all the tasks 10 times, as the 11th run fails. 
> To apply load continually, simply wrap this user-simulator in a loop, or let it be auto restarted by Kubernetes

## Prerequesites

* Node 14.*
* [Yarn](https://yarnpkg.com/)


* Install all the dependencies by running:

```
yarn
```

Adjust the following environment variables to fit your environment:

|         Name          | Example Value     | Description                                                                      |
|-----------------------|-------------------|----------------------------------------------------------------------------------|
| FRONTEND_ADDR         | `unguard.kube/ui`   | The base address for the Unguard frontend, contains no protocol or trailing slash

## Running the user simulator

1. Start Unguard
2. Run the user simulator, pointing it to the Unguard frontend
```
export FRONTEND_ADDR="unguard.kube/ui"
yarn start
```

