FROM gradle:6.9.1-jdk11 AS builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build

FROM eclipse-temurin:11-jre-alpine
EXPOSE 8080
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
WORKDIR /app
ENTRYPOINT ["java","-jar","app.jar"]
