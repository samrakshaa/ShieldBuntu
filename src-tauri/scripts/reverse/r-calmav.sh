#!/bin/bash

echo "Uninstalling and reverting ClamAV configuration..."
sudo systemctl stop clamav-daemon
sudo systemctl disable clamav-daemon
sudo apt remove clamav clamav-daemon -y
sudo apt autoremove -y
echo "ClamAV uninstallation and configuration reverted."
