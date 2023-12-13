#!/bin/bash

# Check if SSH is enabled
function is_ssh_enabled {
    # Check if OpenSSH is installed
    if ! command -v sshd &> /dev/null; then
        echo 0
        return
    fi

    # Check SSH service status
    if command -v systemctl &> /dev/null; then
        systemctl is-active --quiet ssh
    elif command -v service &> /dev/null; then
        service ssh status &> /dev/null
    else
        echo "Unable to check SSH status. Please check manually."
        exit 1
    fi

    if [ $? -eq 0 ]; then
        echo 1
    else
        echo 0
    fi
}

echo {"ssh_state": "$(is_ssh_enabled)"}
