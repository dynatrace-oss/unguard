FROM alpine:3.17.2
RUN apk add mysql-client
COPY ./check.sh /
RUN chmod +x check.sh
ENTRYPOINT ["sh", "/check.sh"]
