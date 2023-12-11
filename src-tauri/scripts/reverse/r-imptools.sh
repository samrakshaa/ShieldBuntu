#!/bin/bash

echo "Disabling automatic security updates..."
sudo dpkg-reconfigure --priority=low unattended-upgrades
sudo apt purge unattended-upgrades -y
echo "Automatic security updates disabled."

echo "Removing and purging ClamAV..."
sudo systemctl stop clamav-daemon
sudo systemctl disable clamav-daemon
sudo apt purge clamav clamav-daemon -y
echo "ClamAV removal completed."

echo "Removing and purging Fail2Ban..."
sudo systemctl stop fail2ban
sudo systemctl disable fail2ban
sudo apt purge fail2ban -y
echo "Fail2Ban removal completed."

echo "Removing and purging RKHunter..."
sudo apt purge rkhunter -y
echo "RKHunter removal completed."

echo "Uninstalling and stopping AppArmor..."
sudo systemctl stop apparmor
sudo systemctl disable apparmor
sudo apt purge apparmor apparmor-utils -y
echo "AppArmor uninstallation completed."

echo "Reversal script completed. Please review the changes and make any additional adjustments as needed."
