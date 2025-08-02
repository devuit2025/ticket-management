#!/bin/bash

# Di chuyển đến thư mục service user
cd "$(dirname "$0")/../api/services/user"

# Chạy app
go run ./cmd
