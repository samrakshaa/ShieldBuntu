#!/bin/bash

TOR_PORTS=("9050" "9150" "9000" "9001" "9051" "9030" "9040")

# Enable ufw if not already enabled
# enable_ufw() {
#     if ! sudo ufw status | grep -q "Status: active"; then
#         sudo ufw enable
#         echo "ufw has been enabled."
#     fi
# }

# Check if Tor ports are blocked using ufw
check_tor_ports() {
    for port in "${TOR_PORTS[@]}"; do
        if sudo ufw status | grep -q "$port.*DENY"; then
            return 0  # Port is blocked
        fi
    done
    return 1  # Ports are not blocked
}

# Main script
# enable_ufw
if check_tor_ports; then
    echo "true"
else
    echo "false"
fi
