#!/bin/bash

# Check if a password is provided as a parameter

# Secure SSH Configuration
echo "Securing SSH configuration..."

# Check if OpenSSH is installed
if ! command -v sshd &> /dev/null; then
    echo "OpenSSH is not installed. Installing..."
    sudo apt update
    sudo apt install ssh -y
fi

sudo systemctl enable ssh
# Locate SSH configuration file
sshd_config_path="/etc/ssh/sshd_config"

# Backup SSH configuration file
sudo cp "$sshd_config_path" "$sshd_config_path.bak"

# Update SSH configuration
sudo sed -i 's/PermitRootLogin no/PermitRootLogin yes/' "$sshd_config_path"
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$sshd_config_path"
sudo sed -i 's/PermitEmptyPasswords yes/PermitEmptyPasswords no/' "$sshd_config_path"
sudo sed -i 's/#PermitUserEnvironment no/PermitUserEnvironment no/' "$sshd_config_path"
sudo sed -i 's/X11Forwarding yes/X11Forwarding no/' "$sshd_config_path"
echo "AllowTcpForwarding no" | sudo -S tee -a "$sshd_config_path" > /dev/null
sudo sed -i 's/Port 22/Port 2222/' "$sshd_config_path"
sudo ufw allow 2222/tcp
echo "Protocol 2" | sudo -S tee -a "$sshd_config_path" > /dev/null

# Restart SSH service
if command -v systemctl &> /dev/null; then
    # Check if SSH service is disabled and enable it
    if ! sudo systemctl is-enabled ssh &> /dev/null; then
        sudo systemctl enable ssh
    fi
    
    sudo systemctl restart ssh
    echo "SSH hardening complete."
elif command -v service &> /dev/null; then
    # Check if SSH service is disabled and enable it
    if [ "$(sudo service ssh status | grep disabled)" ]; then
        sudo update-rc.d ssh enable
    fi
    
    sudo service ssh restart
    echo "SSH hardening complete."
else
    echo "Unable to restart SSH service. Please restart it manually."
fi