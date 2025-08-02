# base image
FROM golang:1.24.5-alpine

# set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# install git
RUN apk update && apk add --no-cache git

# create working directory
WORKDIR /app
# copy go mod and download dependencies
COPY go.mod go.sum ./
RUN go mod tidy
RUN go mod download

# copy source code
COPY . .

# build binary
RUN go build -o user-service ./cmd

# Air hot reload
RUN go install github.com/air-verse/air@latest

COPY .air.toml .

# expose port
EXPOSE 8080

# run the service
CMD ["./user-service", "air"]
