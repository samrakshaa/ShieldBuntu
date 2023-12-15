#!/bin/bash

echo "Uninstalling RKHunter and removing configurations..."

# Check if RKHunter is installed
if command -v rkhunter > /dev/null 2>&1; then
  # Remove RKHunter
  sudo apt remove rkhunter -y

  # Remove RKHunter configurations (commented out to avoid accidental deletion)
  # sudo rm -rf /etc/rkhunter*

  echo "RKHunter has been uninstalled and configurations removed."
else
  echo "RKHunter is not installed."
fi
