# Membership Service

This service provides endpoints to manage memberships of **Unguard** users.

## Getting started

### Requirements

- .NET 7 SDK (https://dotnet.microsoft.com/download/dotnet/7.0)
- environment variables - They are set in Properties/launchSettings.json for local build
- A running MariaDB

```bash
docker run --detach --name memberships-db \
  --env MARIADB_PASSWORD=mariadb-root-password \
  --env MARIADB_DATABASE=memberships \
   -p 3306:3306 \
   mariadb:10.6.12
```

And then update the environment variables for the membership-service to fit:

```bash
export MARIADB_PASSWORD=mariadb-root-password
export MARIADB_SERVICE=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' memberships-db)
```

## Building

##### source:

```
dotnet build
```

##### docker image build:

```
docker build -t membership-service .
```

### Running

##### local

Service will run on port 8083.

```
dotnet run MembershipService.dll
```

##### docker

Image will be forwarded to port 80

```
docker run -it -p 80:8083 --name membership-service-container membership-service
```

### API Endpoints

#### GET /membership-service/{user-id}

Returns the current membership of the requested user ID.

#### POST /membership-service/add/{userid}

Update the user membership by providing it as simple form parameter to the post request:

```
membership={membershipText}
```
