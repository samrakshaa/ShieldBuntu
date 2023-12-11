#!/bin/bash
#script to install important security tools

echo "Enabling automatic security updates..."
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
echo "Automatic security updates enabled."

echo "Installing and configuring ClamAV..."
sudo apt install clamav clamav-daemon -y
sudo freshclam
sudo systemctl enable clamav-daemon
sudo systemctl start clamav-daemon
echo "ClamAV installation and configuration completed."

echo "Installing and configuring Fail2Ban..."
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
echo "Fail2Ban installation and configuration completed."

echo "Installing and configuring RKHunter..."
sudo apt install rkhunter -y
sudo rkhunter --update
sudo rkhunter --propupd


echo "Installing and configuring AppArmor..."
sudo apt install apparmor apparmor-utils -y
sudo aa-enforce /etc/apparmor.d/*
sudo systemctl restart apparmor
echo "AppArmor installation and configuration completed."