#!/bin/bash

echo "Installing Deborphan..."
sudo apt install deborphan -y

echo "Finding unused packages with Deborphan..."
unused_packages=$(deborphan)

if [ -z "$unused_packages" ]; then
    echo "No unused packages found."
else
    echo "Unused packages found:"
    echo "$unused_packages"
    
    echo "Removing unused packages..."
    sudo apt-get remove --purge $unused_packages -y
    echo "Unused packages removed."
fi