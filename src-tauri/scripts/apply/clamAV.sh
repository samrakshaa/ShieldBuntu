#!/bin/bash

echo "Installing and configuring ClamAV..."
sudo apt install clamav clamav-daemon -y
sudo freshclam
sudo systemctl enable clamav-daemon
sudo systemctl start clamav-daemon
echo "ClamAV installation and configuration completed."