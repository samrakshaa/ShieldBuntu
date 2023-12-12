#!/bin/bash

password="$1"

if [ "$EUID" -ne 0 ]; then
    exec sudo "$0" "$@"
fi

echo "Installing and configuring AppArmor..."
echo "$password" | sudo -S apt install apparmor apparmor-utils -y
echo "$password" | sudo -S aa-enforce /etc/apparmor.d/*
echo "$password" | sudo -S systemctl restart apparmor
echo "AppArmor installation and configuration completed."