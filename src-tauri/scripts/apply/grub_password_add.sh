#!/bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi

# Check if the password parameter is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <GRUB_PASSWORD>"
    exit 1
fi

# Retrieve the provided GRUB password
GRUB_PASSWORD="$1"

# Install grub if not already installed
if ! command -v grub-install &> /dev/null; then
    apt update
    apt install grub -y
fi

# Generate password hash
GRUB_PASSWORD_HASH=$(echo -e "$GRUB_PASSWORD\n$GRUB_PASSWORD" | grub-mkpasswd-pbkdf2 | grep "grub.pbkdf2.sha512" | cut -d' ' -f7)

GRUB_CFG="/etc/default/grub"

if [ ! -e "$GRUB_CFG.bak" ]; then
    cp "$GRUB_CFG" "$GRUB_CFG.bak"
fi

# Add the GRUB_PASSWORD line in the GRUB configuration file
echo "GRUB_PASSWORD=$GRUB_PASSWORD_HASH" >> "$GRUB_CFG"

# Update GRUB
update-grub

echo "GRUB password protection is set."