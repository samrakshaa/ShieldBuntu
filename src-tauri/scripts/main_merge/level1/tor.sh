#!/bin/bash

if [ "$(id -u)" != "0" ]; then
    echo "This script must be run as root. Exiting..."
    exit 1
fi

ufw_enable() {
    ufw status | grep -q "Status: inactive"
    if [ $? -eq 0 ]; then
        ufw --force enable
        echo "ufw is now enabled."
    fi
}

block_tor_ports() {
    sudo ufw deny 9000
    sudo ufw deny 9001
    sudo ufw deny 9030
    sudo ufw deny 9040
    sudo ufw deny 9050
    sudo ufw deny 9051
    echo "Blocked Tor ports using ufw."
}

ufw_enable
block_tor_ports

ufw status