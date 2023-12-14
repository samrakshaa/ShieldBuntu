#!/bin/bash

# Check if USBGuard is installed
if ! command -v usbguard &> /dev/null; then
    echo "USBGuard is not installed."
    exit 1
fi

# Function to block a device
block_device() {
    sudo usbguard block-device "$1"
    echo "Device $1 blocked successfully."
}

# Check if at least one device ID is provided
if [ $# -eq 0 ]; then
    echo "No device IDs provided. Please provide at least one device ID to block."
    exit 1
fi

# Loop through all provided device IDs and block each
for device_id in "$@"; do
    block_device "$device_id"
done
