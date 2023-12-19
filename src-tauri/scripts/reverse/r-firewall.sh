#!/bin/bash

# Check if UFW is installed
if ! command -v ufw &> /dev/null; then
    echo "UFW is not installed. Nothing to uninstall."
    exit 0
fi
sudo ufw --force reset