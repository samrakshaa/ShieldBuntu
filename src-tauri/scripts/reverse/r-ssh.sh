#!/bin/bash

# Check if a password is provided as a parameter

echo "Reverting SSH configuration..."

# if command -v sshd &> /dev/null; then
#     echo "OpenSSH is installed. Uninstalling..."
#     sudo apt purge openssh-server openssh-client -y
#     sudo apt update
# fi

# sudo rm -rf /etc/ssh

# Restore the backed-up SSH configuration file
sshd_config_path="/etc/ssh/sshd_config"
sudo cp "$sshd_config_path.bak" "$sshd_config_path"

# Restart SSH service
if command -v systemctl &> /dev/null; then
    sudo systemctl restart ssh
    echo "SSH configuration reverted."
elif command -v service &> /dev/null; then
    sudo service ssh restart
    echo "SSH configuration reverted."
else
    echo "Unable to restart SSH service. Please restart it manually."
fi