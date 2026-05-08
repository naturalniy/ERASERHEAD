FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

RUN apt-get update && apt-get install -y libicu-dev && rm -rf /var/lib/apt/lists/*
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# Эти строки лечат краш 139 на слабом железе облачных провайдеров
ENV DOTNET_TieredCompilation=0
ENV DOTNET_TC_QuickJit=0
ENV DOTNET_ReadyToRun=0

COPY --from=build /app .

# Используй 0.0.0.0 вместо +, это надежнее для бинда порта
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "lynchism.dll"]
