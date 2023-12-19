#!/bin/bash

echo "Installing and configuring RKHunter..."

if ! command -v rkhunter &> /dev/null; then
    sudo apt install rkhunter -y

    if [ $? -eq 0 ]; then
        sudo rkhunter --update
        sudo rkhunter --propupd
        echo "RKHunter installation and configuration completed."
    else
        echo "RKHunter installation failed."
    fi
else
    echo "RKHunter is already installed."
fi