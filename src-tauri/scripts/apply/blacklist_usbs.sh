#!/bin/bash

if ! command -v usbguard &> /dev/null; then
    echo "USBGuard is not installed."
    exit 1
fi
block_device() {
    sudo usbguard block-device "$1"
    echo "Device $1 blocked successfully."
}
if [ $# -eq 0 ]; then
    echo "No device IDs provided. Please provide at least one device ID to block."
    exit 1
fi
for device_id in "$@"; do
    block_device "$device_id"
done
