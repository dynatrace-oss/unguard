FROM gradle:7.4.1-jdk11 AS builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle bootJar

FROM youtaqiu/jre-trace:17
EXPOSE 8080
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
WORKDIR /app
# RUN apt-get update && apt-get install markdown -y
ENTRYPOINT ["java", "-javaagent:/opentelemetry.jar", "-jar", "app.jar"]
