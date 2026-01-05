# ===============================
# STAGE 1: Build
# ===============================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiamo prima solo il csproj e ripristiniamo le dipendenze (Layer caching)
COPY ["MrWhite.Backend.csproj", "./"]
RUN dotnet restore "MrWhite.Backend.csproj"

# Copiamo tutto il resto del codice sorgente
COPY . .

# Compiliamo in modalità Release
RUN dotnet publish "MrWhite.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ===============================
# STAGE 2: Runtime
# ===============================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Espone la porta 80 interna
EXPOSE 80

# Copiamo i file pubblicati dallo stage di build
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "MrWhite.Backend.dll"]