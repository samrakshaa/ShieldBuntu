#!/bin/bash
password="$1"

if [ "$EUID" -ne 0 ]; then
    exec sudo "$0" "$@"
fi
echo "Enabling automatic security updates..."
echo "$password" | sudo -S apt install unattended-upgrades -y
echo "$password" | sudo -S dpkg-reconfigure --priority=low unattended-upgrades
echo "Automatic security updates enabled."