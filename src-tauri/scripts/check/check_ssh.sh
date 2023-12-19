#!/bin/bash

FILE_PATH="/etc/ssh/sshd_config"
if grep -q "#Hardend" "$FILE_PATH"; then
    echo '{"success": true}'
else
    echo '{"success": false}'
fi
