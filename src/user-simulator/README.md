# User Simulator

A benign user simulator for Unguard.
Uses a real browser to simulate a user that does various tasks on the specified Unguard frontend.

Executes following tasks:

* register / login
* visit frontpage
* like a post
* visit personal timelines
* post text posts
* post URL posts
* post image posts
* visit users page and search for admanager user
* upgrades membership status
* log out

> Note: Currently it only executes all the tasks once.
> To apply load continually, a cronjob is used that starts the user-simulator periodically

## Prerequisites

* Node 14.20 (recommended)
* [Yarn](https://yarnpkg.com/)

Install all the dependencies by running:

```
yarn install
```

Adjust the following environment variables to fit your environment:

| Name                    | Example Value                 | Description                                                                                  |
|-------------------------|-------------------------------|----------------------------------------------------------------------------------------------|
| FRONTEND_ADDR           | `unguard-envoy-proxy:8080/ui` | The base address for the Unguard frontend, contains no protocol or trailing slash            |
| SIMULATE_PRIVATE_RANGES | `true`                        | Set to `true` if you want the user simulator to generate traffic from private IP ranges only |

## Running the user simulator

1. Start Unguard
2. Run the user simulator, pointing it to the Unguard frontend

```
export FRONTEND_ADDR="unguard-envoy-proxy:8080/ui"
yarn start
```

