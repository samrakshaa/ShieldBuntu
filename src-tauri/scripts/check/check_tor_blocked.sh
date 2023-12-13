#!/bin/bash

# Define Tor service ports
TOR_PORTS=(9050 9051 9000 9001)

# Function to check if a specific port is denied
is_port_denied() {
    local port=$1
    sudo ufw status | grep -q "$port.*DENY"
    return $?
}

# Check if Tor ports are blocked by UFW
for port in "${TOR_PORTS[@]}"; do
    if ! is_port_denied "$port"; then
        echo "false"
        exit 0
    fi
done

echo "true"