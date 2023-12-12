#!/bin/bash
password="$1"

if [ "$EUID" -ne 0 ]; then
    exec sudo "$0" "$@"
fi
echo "Installing and configuring Fail2Ban..."
echo "$password" | sudo -S apt install fail2ban -y
echo "$password" | sudo -S systemctl enable fail2ban
echo "$password" | sudo -S systemctl start fail2ban
echo "Fail2Ban installation and configuration completed."