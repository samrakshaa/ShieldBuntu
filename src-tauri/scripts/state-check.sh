#!/bin/bash

# Check if UFW is installed
if ! command -v ufw > /dev/null 2>&1; then
  echo "UFW is not installed."
  exit 1
fi

# Check if UFW is enabled
ufw_enabled=$(sudo ufw status | grep -qi 'Status: active'; echo $?)

# Check if the specific rules are already applied
ssh_rule=$(sudo ufw status | grep -qi '22/tcp'; echo $?)
https_rule=$(sudo ufw status | grep -qi '443/tcp'; echo $?)

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

echo {"firewall" : {"ufw_enabled": "$((!ufw_enabled))", "ssh_rule": "$((!ssh_rule))", "https_rule": "$((!https_rule))"}, "ssh_state": "$(is_ssh_enabled)"}
