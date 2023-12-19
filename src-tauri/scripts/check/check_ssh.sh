#!/bin/bash

FILE_PATH="/etc/ssh/sshd_config"
if grep -q "#Hardened" "$FILE_PATH"; then
    echo '{"success": true}'
else
    echo '{"success": false}'
fi
