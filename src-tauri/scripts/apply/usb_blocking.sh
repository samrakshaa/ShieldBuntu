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

# Check if any USB device IDs are provided
if [ $# -eq 0 ]; then
    echo "No USB device IDs provided. Blocking all USB devices."
    sudo usbguard generate-policy --implicit-policy-target=block | sudo tee /etc/usbguard/rules.conf > /dev/null
else
    # Whitelist specified USB devices
    for device_id in "$@"; do
        sudo usbguard allow-device "$device_id"
        echo "Device $device_id whitelisted successfully."
    done

    # Block all other USB devices
    echo "Blocking all other USB devices."
    sudo usbguard generate-policy | sudo tee /etc/usbguard/rules.conf > /dev/null
fi

# Apply the new policy
sudo systemctl restart usbguard
echo "USBGuard policy updated and applied."