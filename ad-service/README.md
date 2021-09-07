# AdService

Contains web-app which displays a simple image, and some Endpoints to manage the ads.

## Getting started

### Requirements

- .net 5 SDK (https://dotnet.microsoft.com/download/dotnet/5.0)
- environment variables - They are set in Properties/launchSettings.json for local build 

## Building

##### source:

```
dotnet build AdService.sln
```

##### docker image build:

```
docker build -t ad-service .
```


### Running


##### local

Service will run on port 8082.

```
dotnet run AdService.dll
```

##### docker 

Image will be forwarded to port 80
```
docker run -it -p 80:8082 --name ad-service-container ad-service 
```

Currently, AdService will show a picture under the path /app/wwwroot/adFolder/bird.jpg.  
Therefore, if your want to a display custom images, you have to mount a folder with a picture named bird.jpg in it and
state it in the command instead of '<your-directory>'.
```
docker run -it -v <your-directory>:/app/wwwroot/adFolder -p 80:8082 --name ad-service-container ad-service 
```

##### docker-compose

If you want to make use of mounting your own folder, make sure to delete volume comments and state your folder.
```
docker compose up -d
```

### API Endpoints

#### GET /ad 

Return a HTML page which will show an image(ad).  
This including a js file which will reload the page after certain time. 
Therefore, the last used image name will be saved in a cookie 
so that the backend knows which imaged should be loaded next.

#### GET /ads  

Return available files on server.

#### POST /delete-ad 

* "filename": string

Deletes the file with the passed attribute name, if existing.

#### POST /update-ad 
* "file": zip-file  

Uploads and extracts a passed zip file.

