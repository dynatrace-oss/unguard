FROM gradle:7.4.1-jdk11 AS builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle bootJar

FROM youtaqiu/jre-trace:17
EXPOSE 8080
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
RUN apk --no-cache add markdown
WORKDIR /app

ENTRYPOINT ["java", "-javaagent:/opentelemetry.jar", "-jar", "app.jar"]
