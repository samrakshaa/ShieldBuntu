#!/bin/bash

# Check if USBGuard is installed
if ! command -v usbguard &> /dev/null; then
    echo "USBGuard is not installed."
    exit 1
fi

# List all USB devices with their status
sudo usbguard list-devices | cat -n
