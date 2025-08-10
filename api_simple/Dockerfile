# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Set Go proxy
ENV GOPROXY=https://goproxy.cn,direct

# Install git and build dependencies
RUN apk add --no-cache git gcc musl-dev

# Copy go.mod and go.sum first to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# For development, we'll run the code directly
CMD ["go", "run", "main.go"]

# Production stage
FROM alpine:latest AS production

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .
COPY .env .

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"] 