#!/bin/bash

# Check if deborphan is installed
if ! command -v deborphan > /dev/null 2>&1; then
  echo "{\"deborphan_status\": \"0\"}"  # deborphan is not installed
  exit 1
fi

# Install deborphan
# sudo apt install deborphan -y

# Find unused packages with deborphan
unused_packages=$(deborphan)

if [ -z "$unused_packages" ]; then
    echo "{\"deborphan_status\": \"1\", \"message\": \"No unused packages found.\"}"
else
    echo "{\"deborphan_status\": \"1\", \"message\": \"Unused packages found:\n$unused_packages\"}"
    
    # Remove unused packages
    sudo apt-get remove --purge $unused_packages -y
    echo "{\"deborphan_status\": \"1\", \"message\": \"Unused packages removed.\"}"
fi
