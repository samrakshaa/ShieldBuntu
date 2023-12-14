#!/bin/bash

# Check if USBGuard is installed
if ! command -v usbguard &> /dev/null; then
    echo "USBGuard is not installed."
    exit 1
fi

# Function to whitelist a device
whitelist_device() {
    sudo usbguard allow-device "$1"
    echo "Device $1 whitelisted successfully."
}

# Check if at least one device ID is provided
if [ $# -eq 0 ]; then
    echo "No device IDs provided. Please provide at least one device ID to whitelist."
    exit 1
fi

# Loop through all provided device IDs and whitelist each
for device_id in "$@"; do
    whitelist_device "$device_id"
done
