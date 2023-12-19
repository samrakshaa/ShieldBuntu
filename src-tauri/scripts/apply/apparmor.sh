#!/bin/bash

echo "Installing and configuring AppArmor..."
sudo apt install apparmor apparmor-utils -y
sudo aa-enforce /etc/apparmor.d/*
sudo systemctl restart apparmor
echo "AppArmor installation and configuration completed."