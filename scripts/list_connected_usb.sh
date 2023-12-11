#! /bin/bash

# Check if the script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (sudo)." >&2
  exit 1
fi

# Get a list of connected USB devices
USB_LIST=$(lsusb)

echo "List of connected USB devices:"
echo "$USB_LIST" | cat -n