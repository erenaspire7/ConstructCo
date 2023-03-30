FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /api
COPY backend.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
EXPOSE 40443
COPY --from=build /app .
ENTRYPOINT ["dotnet", "backend.dll"]