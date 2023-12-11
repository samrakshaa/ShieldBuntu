#!/bin/bash

# Revert SSH Configuration Changes
echo "Reverting SSH configuration changes..."

sudo cp /etc/ssh/sshd_config.bak /etc/ssh/sshd_config

echo "Restarting the SSH service..."
sudo service ssh restart

echo "SSH configuration changes reverted."
