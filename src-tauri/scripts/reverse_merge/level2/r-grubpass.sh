#!/bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi

# Check if GRUB_PASSWORD exists in the GRUB configuration file
GRUB_CFG="/etc/default/grub"
if ! grep -q "^GRUB_PASSWORD=" "$GRUB_CFG"; then
    echo "GRUB password is not set. Exiting."
    exit 1
fi

# Remove the GRUB_PASSWORD line from the GRUB configuration file
sed -i '/^GRUB_PASSWORD=/d' "$GRUB_CFG"

# Restore the original GRUB configuration file from backup
if [ -e "$GRUB_CFG.bak" ]; then
    cp "$GRUB_CFG.bak" "$GRUB_CFG"
fi

# Update GRUB
update-grub

echo "GRUB password protection is removed."
