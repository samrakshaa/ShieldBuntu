#!/bin/bash

echo "Installing and configuring Fail2Ban..."

if ! command -v fail2ban-client &> /dev/null; then
    sudo apt install fail2ban -y

    if [ $? -eq 0 ]; then
        if ! systemctl is-enabled fail2ban &> /dev/null; then
            sudo systemctl enable fail2ban
        fi

        if ! systemctl is-active --quiet fail2ban; then
            sudo systemctl start fail2ban
        fi

        echo "Fail2Ban installation and configuration completed."
    else
        echo "Fail2Ban installation failed."
    fi
fi