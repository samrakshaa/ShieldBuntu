#!/bin/bash

echo "Uninstalling Fail2Ban..."
sudo systemctl stop fail2ban
sudo systemctl disable fail2ban
sudo apt remove --purge fail2ban -y
sudo apt autoremove -y
echo "Fail2Ban uninstallation completed."
