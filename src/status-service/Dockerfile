FROM golang:1.18-alpine as builder

RUN apk add git

# Set destination for COPY
RUN mkdir /app
ADD . /app
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./

# Download all the dependencies
RUN go mod download

# Copy the source code.
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o status-service .

# GO Repo base repo
FROM alpine:latest

RUN apk --no-cache add ca-certificates

RUN mkdir /app

WORKDIR /app/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/status-service .

EXPOSE 8083

# Run
CMD [ "./status-service" ]
