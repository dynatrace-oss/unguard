FROM gradle:7.4.1-jdk11 AS builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle bootJar

FROM youtaqiu/jre-trace@sha256:1d3cc26f9de63a75ba2f915a8079247b4f1f250a16f219dc322bf2d011c78d55
EXPOSE 8080
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
RUN apk --no-cache add markdown
WORKDIR /app

ENTRYPOINT ["java", "-javaagent:/app/lib/opentelemetry.jar", "-jar", "app.jar"]
