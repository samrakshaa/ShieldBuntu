#!/bin/bash

echo "Enabling automatic security updates..."
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
echo "Automatic security updates enabled."