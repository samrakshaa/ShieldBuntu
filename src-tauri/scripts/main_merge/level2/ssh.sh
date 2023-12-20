#!/bin/bash
echo "Securing SSH configuration..."

if ! command -v openssh-server &> /dev/null; then
       echo "OpenSSH Not Installed"
       exit 1;

backup_file="$sshd_config_path.bak"
if [ ! -e "$backup_file" ]; then
    sudo cp "$sshd_config_path" "$sshd_config_path.bak"
fi

# Update SSH configuration
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$sshd_config_path"
sudo sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords no/' "$sshd_config_path"
sudo sed -i 's/#PermitUserEnvironment no/PermitUserEnvironment no/' "$sshd_config_path"
sudo sed -i 's/X11Forwarding yes/X11Forwarding no/' "$sshd_config_path"
sudo sed -i 's/#AllowTcpForwarding yes/AllowTcpForwarding no/' "$sshd_config_path"
sudo sed -i 's/#Port 22/Port 7069/' "$sshd_config_path"
sudo ufw allow in 7069
sudo ufw allow out 7069
echo "#Hardened" | sudo -S tee -a "$sshd_config_path" > /dev/null

if command -v systemctl &> /dev/null; then
    if ! sudo systemctl is-enabled ssh &> /dev/null; then
        sudo systemctl enable ssh
    fi
    
    sudo systemctl restart ssh
    echo "SSH hardening complete."
elif command -v service &> /dev/null; then
    if [ "$(sudo service ssh status | grep disabled)" ]; then
        sudo update-rc.d ssh enable
    fi
    
    sudo service ssh restart
    echo "SSH hardening complete."
else
    echo "Unable to restart SSH service. Please restart it manually."
fi
