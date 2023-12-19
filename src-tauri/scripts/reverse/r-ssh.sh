#!/bin/bash

echo "Reverting SSH configuration..."
sshd_config_path="/etc/ssh/sshd_config"
sudo cp "$sshd_config_path.bak" "$sshd_config_path"

if command -v systemctl &> /dev/null; then
    sudo systemctl restart ssh
    echo "SSH configuration reverted."
elif command -v service &> /dev/null; then
    sudo service ssh restart
    echo "SSH configuration reverted."
else
    echo "Unable to restart SSH service. Please restart it manually."
fi