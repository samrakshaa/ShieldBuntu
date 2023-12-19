#!/bin/bash

if ! command -v usbguard &> /dev/null; then
    echo "USBGuard is not installed."
    exit 1
fi
sudo usbguard list-devices | cat -n
