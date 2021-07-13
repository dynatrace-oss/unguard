FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

# Copy csproj and restore as distinct layers
WORKDIR /src
COPY ["ad-service.csproj", "."]
RUN dotnet restore "ad-service.csproj"

# Copy everything else and build
WORKDIR /src
COPY . .
RUN dotnet build "ad-service.csproj" -c Release -o /app/build

# publish
FROM build AS publish
RUN dotnet publish "ad-service.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ad-service.dll"]

