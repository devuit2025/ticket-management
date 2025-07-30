# Stage 1: Build app
FROM golang:1.22-alpine AS builder

# Cài đặt git và build tools
RUN apk add --no-cache git

# Set working dir trong container
WORKDIR /app

# Copy go.mod và go.sum để download deps trước (cache)
COPY services/user/go.mod services/user/go.sum ./services/user/
RUN go mod download

# Copy toàn bộ source code service user
COPY . .

# Build binary
RUN go build -o user-service ./cmd/main.go

# Stage 2: Run binary
FROM alpine:latest

WORKDIR /root/

# Copy binary từ stage builder
COPY --from=builder /app/user-service .

# Expose port service user
EXPOSE 8000

# Run binary
CMD ["./user-service"]
