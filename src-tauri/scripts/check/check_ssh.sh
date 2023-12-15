#!/bin/bash

# Define the file path
FILE_PATH="/etc/ssh/sshd_config"

# Check if the text "#Hardend" exists in the file
if grep -q "#Hardend" "$FILE_PATH"; then
    # If found, echo JSON with enabled: true
    echo '{"success": true}'
else
    # If not found, echo JSON with enabled: false
    echo '{"success": false}'
fi
