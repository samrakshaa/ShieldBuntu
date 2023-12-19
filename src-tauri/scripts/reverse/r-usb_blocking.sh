#!/bin/bash

if ! command -v usbguard &> /dev/null; then
    echo "Installing usbguard..."
    sudo apt-get update
    sudo apt-get install -y usbguard
else
    echo "usbguard is already installed."
fi
if ! sudo systemctl is-active --quiet usbguard; then
    echo "Starting usbguard service..."
    sudo systemctl start usbguard
else
    echo "usbguard service is already running."
fi

policy_file="/etc/usbguard/rules.conf"
if [ ! -f "$policy_file" ]; then
    echo "Creating initial usbguard policy file..."
    sudo usbguard generate-policy > "$policy_file"
else
    echo "usbguard policy file already exists."
fi

for device_id in "$@"; do
    sudo usbguard allow-device "$device_id"
    echo "Device $device_id unblocked successfully."
done