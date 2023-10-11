# Like Service

Provides REST endpoints for retrieving and updating like counts for posts in MariaDB:
* `POST like-service/like/123` (likes post with postId 123)
* `DELETE like-service/like?postId=123` (unlikes post with postId 123)
* `GET like-service/like?postId=1&postId=2&postId=3&postId=4...`
    ```
    Response:
    {
        "likeCounts": [
            {"postId": 1, "likeCount": 123},
            {"postId": 2, "likeCount": 456},
            {"postId": 3, "likeCount": 789},
            {"postId": 4, "likeCount": 135},
            ...
        ],
        "likedPosts": [
            {"postId": 1},
            {"postId": 3},
            ...
        ]
    }
    ```
All the endpoints require that a JWT cookie be sent for authentication with the the `user-auth-service`. This cookie is obtained by logging in and links the requests to a user ID.

# How to run locally
The Like Service can either be run using `skaffold dev` (see [DEV-GUIDE](../../docs/DEV-GUIDE.md)), or it can be run locally, provided that you have the following requirements installed.

## Requirements
* PHP 8.0 with `opentelemetry` (e.g. version `1.0.0RC1`) and MySQL (`mysqli`, `pdo`, `pdo_mysql`) extensions installed
* Composer (e.g. version `2.6.5`; see [Installing Composer](https://getcomposer.org/download/))
* MariaDB instance (see [user-auth-service README](../user-auth-service/README.md) for setting it up)

## Environment Variables
The following environment variables need to be set:

| Name                      | Example Value             | Description                                                 |
|---------------------------|---------------------------|-------------------------------------------------------------|
| SERVICE_NAME              | unguard-like-service      | Name of the service                                         |
| API_PATH                  | /like-service             | Api entrypoint path                                         |
| SERVER_PORT               | 8000                      | The port that the server will run on                        |
| USER_AUTH_SERVICE_ADDRESS | unguard-user-auth-service | Change to hostname/IP of user-auth-service instance         |
| DB_HOST                   | localhost                 | Address of MariaDB instance                                 |
| DB_PORT                   | 3306                      | Port of MariaDB instance                                    |
| DB_DATABASE               | likeDb                    | Database to create and use on the MariaDB instance          |
| DB_USERNAME               | root                      | Username of the MariaDB user                                |
| MARIADB_PASSWORD          |                           | Password of the MariaDB user                                |
| JAEGER_DISABLED           | true                      | Set to 'false' if you have a Jaeger instance running        |
| JAEGER_COLLECTOR_HOST     | collector                 | Change to hostname/IP of your Jaeger collector              |
| JAEGER_PORT               | 4318                      | The jaeger collector port for HTTP OTLP traffic             |
| JAEGER_SERVICE_NAME       | unguard-like-service      | Name that will be used for the service in the Jaeger traces |

## Setup
Install the required packages: 
```
composer install
```
Create the database and create tables:
```
php artisan make:database
php artisan migrate:fresh
```
Run Laravel:
```
php artisan serve
```
