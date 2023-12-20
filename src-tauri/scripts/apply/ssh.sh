#!/bin/bash

default_port=22
if [ "$#" -eq 0 ]; then
    echo "No port specified. Using default port $default_port."
    port=$default_port
else
    port=$1
    echo "Using specified port $port."
fi

check_internet() {
    wget -q --spider http://example.com

    if [ $? -eq 0 ]; then
        return 0
    else
        return 1 
    fi
}

echo "Securing or Reverting SSH configuration..."
sshd_config_path="/etc/ssh/sshd_config"

backup_file="$sshd_config_path.bak"

if [ "$1" == "-r" ] && [ "$#" -eq 1 ]; then
    sudo cp "$backup_file" "$sshd_config_path"
    sudo service ssh restart
    echo "Reverted SSH changes."
else
    if [ ! -e "$backup_file" ]; then
        sudo cp "$sshd_config_path" "$sshd_config_path.bak"
    fi

    for param in "${@:2}"; do
        case $param in
            1) sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$sshd_config_path" ;;
            2) sudo sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords no/' "$sshd_config_path" ;;
            3) sudo sed -i 's/#PermitUserEnvironment no/PermitUserEnvironment no/' "$sshd_config_path" ;;
            4) sudo sed -i 's/X11Forwarding yes/X11Forwarding no/' "$sshd_config_path" ;;
            5) sudo sed -i 's/#AllowTcpForwarding yes/AllowTcpForwarding no/' "$sshd_config_path" ;;
            *) echo "Invalid parameter: $param" ;;
        esac
    done
    sudo sed -i 's/#Port 22/Port '$port'/' "$sshd_config_path"
    sudo ufw allow in $port
    sudo ufw allow out $port
    echo "#Hardened" | sudo -S tee -a "$sshd_config_path" > /dev/null
    sudo service ssh restart
    echo "Secured SSH configuration."
fi