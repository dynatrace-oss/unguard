FROM mcr.microsoft.com/dotnet/aspnet:5.0-alpine AS base
WORKDIR /app
EXPOSE 8082

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build

# Copy csproj and restore as distinct layers
WORKDIR /src
COPY ["AdService.csproj", "."]
RUN dotnet restore "AdService.csproj"

# Copy everything else and build
WORKDIR /src
COPY . .
RUN dotnet build "AdService.csproj" -c Release -o /app/build

# publish
FROM build AS publish
RUN dotnet publish "AdService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AdService.dll"]

