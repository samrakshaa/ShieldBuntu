#!/bin/bash

# Script to disable AppArmor and enable SELinux

# Disable AppArmor
sudo systemctl stop apparmor
sudo systemctl disable apparmor
sudo systemctl mask apparmor

# Install SELinux packages
sudo apt-get update
sudo apt install policycoreutils selinux-basics selinux-utils -y
sudo selinux-activate
echo "Reboot Whenever you feel comfortable"
echo "Then type 'sudo setenforce 1' in terminal"