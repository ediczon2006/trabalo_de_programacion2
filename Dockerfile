# Etapa 1: Compilacion de modulo nativo C++ y aplicacion Java Maven
FROM maven:3.9.9-eclipse-temurin-21 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY native ./native
RUN mkdir -p native/bin && g++ -std=c++17 -O2 native/image_analyzer.cpp -o native/bin/image_analyzer

COPY src ./src
RUN mvn -B -q package -DskipTests

# Etapa 2: Imagen final liviana con Java 21 + binario C++ + frontend
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/target/software-app.jar ./software-app.jar
COPY --from=builder /app/native/bin/image_analyzer ./native/bin/image_analyzer
COPY web ./web

ENV PORT=8080
ENV WEB_ROOT=/app/web
ENV DB_PATH=/app/data/solicitudes.db
ENV UPLOAD_DIR=/app/data/uploads
ENV CPP_ANALYZER_BIN=/app/native/bin/image_analyzer
ENV WHATSAPP_COUNTRY_CODE=51
ENV WHATSAPP_NUMBER=914662798

RUN mkdir -p /app/data/uploads && chmod +x ./native/bin/image_analyzer

EXPOSE 8080
CMD ["java", "-jar", "/app/software-app.jar"]
