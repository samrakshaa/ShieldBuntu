#!/bin/bash

check_internet() {
    wget -q --spider http://example.com

    if [ $? -eq 0 ]; then
        return 0  
    else
        return 1 
    fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$SCRIPT_DIR/../package"

# Function to install a package
install_package() {
    local package_file="$1"
    sudo dpkg -i $package_file.deb
}
if check_internet; then
    sudo apt update
    sudo apt install ufw -y
else
    install_package "$PACKAGE_DIR/ufw"
fi

if [ "$#" -eq 2 ]; then
    resource=$1
    opt=$2

    # Check if the resource is an IP or a port
    if [[ "$resource" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        # IP address provided
        if [ "$opt" == "a" ]; then
            sudo ufw allow from "$resource" to any
        elif [ "$opt" == "d" ]; then
            sudo ufw deny from "$resource" to any
        else
            echo "Invalid option. Please provide 'a' to allow or 'd' to deny."
            exit 1
        fi
    else
        # Port number provided
        if [ "$opt" == "a" ]; then
            sudo ufw allow "$resource"/tcp
        elif [ "$opt" == "d" ]; then
            sudo ufw deny "$resource"/tcp
        else
            echo "Invalid option. Please provide 'a' to allow or 'd' to deny."
            exit 1
        fi
    fi

elif [ "$#" -eq 0 ]; then
    sudo ufw default allow outgoing
    # sudo ufw default deny incoming
    sudo ufw default deny routed
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
    sudo ufw deny in from 127.0.0.0/8
    sudo ufw deny in from ::1
    sudo ufw allow in on lo
    sudo ufw allow out on lo
else
    echo "Invalid number of parameters. Usage: $0 [port|IP] [a|r]"
    exit 1
fi

sudo ufw default allow outgoing
# sudo ufw default deny incoming
sudo ufw default deny routed
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw deny in from 127.0.0.0/8
sudo ufw deny in from ::1
sudo ufw allow in on lo
sudo ufw allow out on lo
echo "yes" | sudo ufw enable
sudo ufw logging on
echo "UFW configuration complete."