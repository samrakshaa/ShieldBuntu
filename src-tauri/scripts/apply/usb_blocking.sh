#!/bin/bash

if ! command -v usbguard &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y usbguard
fi
sudo systemctl start usbguard
if [ ! -f /etc/usbguard/rules.conf ]; then
    sudo usbguard generate-policy > /etc/usbguard/rules.conf
fi
for device_id in "$@"; do
    usbguard block-device "$device_id"
    echo "Device $device_id blocked successfully."
done