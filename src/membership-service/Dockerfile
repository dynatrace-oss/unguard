FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS base
WORKDIR /app
EXPOSE 8083

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Copy csproj and restore as distinct layers
WORKDIR /src
COPY ["MembershipService.csproj", "."]
RUN dotnet restore "MembershipService.csproj"

# Copy everything else and build
WORKDIR /src
COPY . .
RUN dotnet build "MembershipService.csproj" -c Release -o /app/build

# publish
FROM build AS publish
RUN dotnet publish "MembershipService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MembershipService.dll"]

