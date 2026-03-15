FROM eclipse-temurin:21-jdk-alpine
RUN apk update && apk upgrade 

WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar", "-Dspring-boot.run.profiles=prod"]
