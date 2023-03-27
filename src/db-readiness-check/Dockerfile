FROM alpine
RUN apk add curl
RUN apk add jq
RUN apk add mysql-client
COPY ./check.sh /
RUN chmod +x check.sh
ENTRYPOINT ["sh", "/check.sh"]
