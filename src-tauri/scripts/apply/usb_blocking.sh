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

# Block all USB devices initially
echo "Blocking all USB devices."
# sudo usbguard generate-policy --implicit-policy-target=block | sudo tee /etc/usbguard/rules.conf > /dev/null

# Whitelist specified USB devices
# if [ $# -eq 0 ]; then
#     echo "No USB device IDs provided. All USB devices are blocked."
# else
#     for device_id in "$@"; do
#         sudo usbguard allow-device "$device_id"
#         echo "Device $device_id whitelisted successfully."
#     done
# fi

# Apply the new policy
sudo systemctl restart usbguard
echo "USBGuard policy updated and applied."
