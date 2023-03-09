FROM openjdk:8u111-jdk-alpine as builder

COPY . /home/gradle/src
WORKDIR /home/gradle/src
RUN ./gradlew build
RUN ls build/libs/

# force JDK < 8u121 to provoke CVE-2021-44228 10.0 RCE in log4j < 2.4.1
# https://security.snyk.io/vuln/SNYK-JAVA-ORGAPACHELOGGINGLOG4J-2314720
FROM openjdk:8u111-jre
EXPOSE 8081
COPY --from=builder /home/gradle/src/build/libs/**.jar /app/app.jar
WORKDIR /app
ENTRYPOINT ["java","-jar","app.jar"]
