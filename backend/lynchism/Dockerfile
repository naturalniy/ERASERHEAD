FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source
COPY lynchism.csproj .
RUN dotnet restore
COPY . . 
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
# Это лечит 90% ошибок сегментации (139) на Linux-серверах
RUN apt-get update && apt-get install -y libicu-dev
WORKDIR /app
COPY --from=build /app .

# Render требует порт 10000 по умолчанию
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "lynchism.dll"]
