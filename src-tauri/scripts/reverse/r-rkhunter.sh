#!/bin/bash

echo "Uninstalling RKHunter and removing configurations..."
if command -v rkhunter > /dev/null 2>&1; then
  sudo apt remove rkhunter -y
  echo "RKHunter has been uninstalled and configurations removed."
else
  echo "RKHunter is not installed."
fi
