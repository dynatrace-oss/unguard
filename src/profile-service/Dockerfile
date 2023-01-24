FROM gradle:7.4.1-jdk11 as builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle bootJar

FROM openjdk:11-jre
EXPOSE 8080
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
RUN mkdir /opt/opentelemetry
WORKDIR /opt/opentelemetry
RUN wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/download/v1.17.0/opentelemetry-javaagent.jar  \
    && chmod a+rwx /opt/opentelemetry
WORKDIR /app
RUN apt-get update && apt-get install markdown -y
ENTRYPOINT ["java", "-javaagent:/opt/opentelemetry/opentelemetry-javaagent.jar", "-jar", "app.jar"]
