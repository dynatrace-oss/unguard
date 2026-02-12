FROM gradle:8.14-jdk21 AS builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon

FROM eclipse-temurin:21-jre-alpine
EXPOSE 8080
COPY --from=builder /home/gradle/src/build/libs/*.jar /app/app.jar
WORKDIR /app
ENTRYPOINT ["java","-jar","app.jar"]
