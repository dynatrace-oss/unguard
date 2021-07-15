# AdService
Contains web-app which displays a simple image.

## Getting started

### Requirements

- .net 5 SDK (https://dotnet.microsoft.com/download/dotnet/5.0)

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
```
dotnet run AdService.dll
```

##### docker 
run image on port 80
```
docker run -it -p 80:80 --name ad-service-container ad-service 
```

Currently AdService will show a picture under the path /app/wwwroot/adFolder/bird.jpg.  
Therefore, if your want to display customized images, you have mount a folder with a picture named bird.jpg in it and
state it in the command instead of '<your-directory>'.
```
docker run -it -v <your-directory>:/app/wwwroot/adFolder -p 80:80 --name ad-service-container ad-service 
```

##### docker-compose

If you want to make use of mounting your own folder, make sure to delete volume comments and state your folder.
```
docker compose up -d
```


