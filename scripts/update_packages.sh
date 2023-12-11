#!/bin/bash

echo "Updating and upgrading the system..."
sudo apt update
sudo apt full-upgrade -y
sudo apt autoremove -y
sudo apt clean
echo "Update and upgrade completed."