FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Копируем только файл проекта для кэширования слоев
COPY lynchism.csproj .
RUN dotnet restore

# Копируем остальное и собираем
COPY . . 
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Устанавливаем поддержку ICU и отключаем Invariant mode (лечит ошибку 139)
RUN apt-get update && apt-get install -y libicu-dev && rm -rf /var/lib/apt/lists/*
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app .

# Указываем 8080 (стандарт для Render сервисов)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "lynchism.dll"]
