#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi
if [ -z "$1" ]; then
    echo "Usage: $0 <GRUB_PASSWORD>"
    exit 1
fi
GRUB_PASSWORD="$1"
if ! command -v grub-install &> /dev/null; then
    apt update
    apt install grub -y
fi
GRUB_PASSWORD_HASH=$(echo -e "$GRUB_PASSWORD\n$GRUB_PASSWORD" | grub-mkpasswd-pbkdf2 | grep "grub.pbkdf2.sha512" | cut -d' ' -f7)

GRUB_CFG="/etc/default/grub"

if [ ! -e "$GRUB_CFG.bak" ]; then
    cp "$GRUB_CFG" "$GRUB_CFG.bak"
fi
echo "GRUB_PASSWORD=$GRUB_PASSWORD_HASH" >> "$GRUB_CFG"

update-grub

echo "GRUB password protection is set."