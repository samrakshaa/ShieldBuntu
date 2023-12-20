#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi
GRUB_CFG="/etc/default/grub"
if grep -q "^GRUB_PASSWORD=" "$GRUB_CFG"; then
    echo true
    exit 0
else
    echo false
    exit 1
fi