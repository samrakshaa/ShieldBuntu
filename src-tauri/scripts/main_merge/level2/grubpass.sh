#!/bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi

# Check if GRUB_PASSWORD already exists in the GRUB configuration file
GRUB_CFG="/etc/default/grub"
if grep -q "^GRUB_PASSWORD=" "$GRUB_CFG"; then
    echo "GRUB password is already set. Exiting."
    exit 1
fi

# Prompt user for the GRUB password
read -sp "Enter GRUB password: " GRUB_PASSWORD
echo

GRUB_PASSWORD_HASH=$(echo -e "$GRUB_PASSWORD\n$GRUB_PASSWORD" | grub-mkpasswd-pbkdf2 | grep "grub.pbkdf2.sha512" | cut -d' ' -f7)

# Backup the GRUB configuration file
if [ ! -e "$GRUB_CFG.bak" ]; then
    cp "$GRUB_CFG" "$GRUB_CFG.bak"
fi

# Add the GRUB_PASSWORD line in the GRUB configuration file
echo "GRUB_PASSWORD=$GRUB_PASSWORD_HASH" >> "$GRUB_CFG"

# Update GRUB
update-grub

echo "GRUB password protection is set."