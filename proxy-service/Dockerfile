FROM gradle:jdk8 as builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build
RUN ls build/libs/

FROM openjdk:8-jre-alpine
RUN apk --no-cache add curl
EXPOSE 8081
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
WORKDIR /app
ENTRYPOINT ["java","-jar","app.jar"]
