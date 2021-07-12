FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR "/src"
COPY ["dotNet-ad-service.csproj", "."]
RUN dotnet restore "dotNet-ad-service.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "dotNet-ad-service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "dotNet-ad-service.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dotNet-ad-service.dll"]

