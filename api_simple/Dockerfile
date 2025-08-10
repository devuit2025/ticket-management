# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install git and build dependencies
RUN apk add --no-cache git
RUN apk add --no-cache gcc musl-dev
# For development, we'll mount the source code
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