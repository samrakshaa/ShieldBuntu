#!/bin/bash
password="$1"

if [ "$EUID" -ne 0 ]; then
    exec sudo "$0" "$@"
fi
echo "Installing and configuring RKHunter..."
echo "$password" | sudo -S apt install rkhunter -y
echo "$password" | sudo -S rkhunter --update
echo "$password" | sudo -S rkhunter --propupd