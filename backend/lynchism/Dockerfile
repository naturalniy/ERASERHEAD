# ШАГ 1: Сборка (ОБЯЗАТЕЛЬНО добавь AS build в конце первой строки)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

COPY lynchism.csproj .
RUN dotnet restore

COPY . . 
RUN dotnet publish -c Release -o /app

# ШАГ 2: Рантайм
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

RUN apt-get update && apt-get install -y libicu-dev && rm -rf /var/lib/apt/lists/*
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV DOTNET_TieredCompilation=0
ENV DOTNET_TC_QuickJit=0
ENV DOTNET_ReadyToRun=0

# Теперь эта команда поймет, что такое --from=build
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "lynchism.dll"]
