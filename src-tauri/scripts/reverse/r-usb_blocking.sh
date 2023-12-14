#!/bin/bash

# Check if USBGuard is installed
if ! command -v usbguard &> /dev/null; then
    echo "USBGuard is not installed. No actions required."
    exit 0
fi

# Stop the USBGuard service
echo "Stopping USBGuard service..."
sudo systemctl stop usbguard

# Optionally: Reset USBGuard rules to a default state
# Warning: This will remove all existing rules. Uncomment the next line if needed.
# sudo echo "" > /etc/usbguard/rules.conf

# Disable the USBGuard service
echo "Disabling USBGuard service from starting at boot..."
sudo systemctl disable usbguard
sudo apt remove usbguard
echo "USBGuard has been reset and disabled."
