#!/bin/bash

menu() {
    echo "USB Management Menu:"
    echo "1. List allowed devices"
    echo "2. List blocked devices"
    echo "3. Block a device"
    echo "4. Allow a device"
    echo "5. Exit"
    read -p "Enter your choice (1-5): " choice
}

list_allowed_devices() {
    echo "Allowed Devices:"
    sudo usbguard list-devices --allowed
}

list_blocked_devices() {
    echo "Blocked Devices:"
    sudo usbguard list-devices --blocked
}

block_device() {
    read -p "Enter the device ID to block: " device_id
    sudo usbguard block-device "$device_id"
    echo "Device $device_id blocked successfully."
}

allow_device() {
    read -p "Enter the device ID to allow: " device_id
    sudo usbguard allow-device "$device_id"
    echo "Device $device_id allowed successfully."
}



if ! sudo systemctl is-active --quiet usbguard; then
    sudo systemctl start usbguard
fi

policy_file="/etc/usbguard/rules.conf"
if [ ! -f "$policy_file" ]; then
    sudo usbguard generate-policy > "$policy_file"
fi

while :
do
    menu
    case $choice in
        1) list_allowed_devices ;;
        2) list_blocked_devices ;;
        3) block_device ;;
        4) allow_device ;;
        5) exit 0 ;;
        *) echo "Invalid choice." ;;
    esac
done