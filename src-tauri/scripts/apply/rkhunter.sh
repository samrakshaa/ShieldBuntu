#!/bin/bash

echo "Installing and configuring RKHunter..."
sudo apt install rkhunter -y
sudo rkhunter --update
sudo rkhunter --propupd