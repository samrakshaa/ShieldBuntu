#!/bin/bash

# Install usbguard if not installed
if ! command -v usbguard &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y usbguard
fi

sudo systemctl start usbguard

# Create initial policy if not exists
if [ ! -f /etc/usbguard/rules.conf ]; then
    sudo usbguard generate-policy > /etc/usbguard/rules.conf
fi

for device_id in "$@"; do
    usbguard allow-device "$device_id"
    echo "Device $device_id unblocked successfully."
done