#!/bin/bash

function is_ssh_enabled {
    if ! command -v sshd &> /dev/null; then
        echo 0
        return
    fi
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
