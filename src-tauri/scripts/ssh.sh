#!/bin/bash

# Check if a password is provided as a parameter
if [ -z "$1" ]; then
    echo "Usage: $0 <password>"
    exit 1
fi

password="$1"

if [ "$EUID" -ne 0 ]; then
    exec sudo "$0" "$@"
fi

# Secure SSH Configuration
echo "Securing SSH configuration..."

# Check if OpenSSH is installed
if ! command -v sshd &> /dev/null; then
    echo "OpenSSH is not installed. Installing..."
    echo "$password" | sudo -S apt update
    echo "$password" | sudo -S apt install ssh -y
fi

# Locate SSH configuration file
sshd_config_path="/etc/ssh/sshd_config"

# Backup SSH configuration file
echo "$password" | sudo -S cp "$sshd_config_path" "$sshd_config_path.bak"

# Update SSH configuration
echo "$password" | sudo -S sed -i 's/PermitRootLogin yes/PermitRootLogin no/' "$sshd_config_path"
echo "$password" | sudo -S sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$sshd_config_path"
echo "$password" | sudo -S sed -i 's/PermitEmptyPasswords yes/PermitEmptyPasswords no/' "$sshd_config_path"
echo "$password" | sudo -S sed -i 's/#PermitUserEnvironment no/PermitUserEnvironment no/' "$sshd_config_path"
echo "$password" | sudo -S sed -i 's/X11Forwarding yes/X11Forwarding no/' "$sshd_config_path"
echo "AllowTcpForwarding no" | sudo -S tee -a "$sshd_config_path" > /dev/null
echo "$password" | sudo -S sed -i 's/Port 22/Port 2222/' "$sshd_config_path"
echo "$password" | sudo -S ufw allow 2222/tcp
echo "Protocol 2" | sudo -S tee -a "$sshd_config_path" > /dev/null

# Restart SSH service
if command -v systemctl &> /dev/null; then
    # Check if SSH service is disabled and enable it
    if ! sudo systemctl is-enabled ssh &> /dev/null; then
        echo "$password" | sudo -S systemctl enable ssh
    fi
    
    echo "$password" | sudo -S systemctl restart ssh
    echo "SSH hardening complete."
elif command -v service &> /dev/null; then
    # Check if SSH service is disabled and enable it
    if [ "$(sudo service ssh status | grep disabled)" ]; then
        echo "$password" | sudo -S update-rc.d ssh enable
    fi
    
    echo "$password" | sudo -S service ssh restart
    echo "SSH hardening complete."
else
    echo "Unable to restart SSH service. Please restart it manually."
fi
