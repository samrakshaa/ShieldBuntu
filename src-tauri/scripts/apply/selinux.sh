#!/bin/bash

sudo systemctl stop apparmor
sudo systemctl disable apparmor
sudo systemctl mask apparmor
sudo apt-get update
sudo apt install policycoreutils selinux-basics selinux-utils -y
sudo selinux-activate
echo "Reboot Whenever you feel comfortable"
echo "Then type 'sudo setenforce 1' in terminal"