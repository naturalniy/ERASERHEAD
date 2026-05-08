# Сборка
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# Копируем только файл проекта для кэширования слоев
COPY lynchism.csproj .
RUN dotnet restore

# Копируем остальное и собираем
COPY . . 
RUN dotnet publish -c Release -o /app

# Рантайм
FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy
WORKDIR /app

# Установка ICU для работы с кириллицей и датами
RUN apt-get update && apt-get install -y libicu-dev && rm -rf /var/lib/apt/lists/*

# ОГРАНИЧЕНИЕ ПАМЯТИ (чтобы не вылетало на бесплатных тарифах)
ENV DOTNET_GCHeapHardLimit=1C000000
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

COPY --from=build /app .

ENTRYPOINT ["dotnet", "lynchism.dll"]
