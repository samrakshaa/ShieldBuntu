#!/bin/bash

# Get a list of connected USB devices
USB_LIST=$(lsusb)

# Display the list with numbered options
# echo "List of connected USB devices:"
echo "$USB_LIST" 