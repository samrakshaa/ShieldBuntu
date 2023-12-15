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

# Check if parameters are provided
if [ "$#" -eq 0 ]; then
    # Block all devices
    sudo usbguard block --any-device
    echo "All devices blocked successfully."
else
    # Block specific devices
    for device_id in "$@"; do
        sudo usbguard block-device "$device_id"
        echo "Device $device_id blocked successfully."
    done
fi
