FROM gradle:jdk8 as builder

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build
RUN ls build/libs/

# force JDK < 8u121 to provoke CVE-2021-44228 10.0 RCE in log4j < 2.15
# https://security.snyk.io/vuln/SNYK-JAVA-ORGAPACHELOGGINGLOG4J-2314720
FROM openjdk:8u111-jre-alpine
RUN apk --no-cache add curl
EXPOSE 8081
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
WORKDIR /app
ENTRYPOINT ["java","-jar","app.jar"]
