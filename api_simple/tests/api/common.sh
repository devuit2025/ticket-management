#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080/api/v1"

# Admin credentials
ADMIN_PHONE="0987654321"
ADMIN_PASSWORD="Password123!"
ADMIN_NAME="Admin"

# Function to get admin token
get_admin_token() {
    # Try to login first
    local response=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"phone\": \"$ADMIN_PHONE\",
            \"password\": \"$ADMIN_PASSWORD\"
        }")
    
    # Check if login successful
    if echo "$response" | grep -q "token"; then
        echo "$response" | sed 's/.*"token":"\([^"]*\)".*/\1/'
        return 0
    fi

    # If login failed, try to register
    echo "Admin login failed. Trying to register..." >&2
    response=$(curl -s -X POST "$BASE_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{
            \"phone\": \"$ADMIN_PHONE\",
            \"password\": \"$ADMIN_PASSWORD\",
            \"name\": \"$ADMIN_NAME\",
            \"role\": \"admin\"
        }")

    # Try login again after registration
    response=$(curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"phone\": \"$ADMIN_PHONE\",
            \"password\": \"$ADMIN_PASSWORD\"
        }")
    
    # Extract token
    echo "$response" | sed 's/.*"token":"\([^"]*\)".*/\1/'
} 