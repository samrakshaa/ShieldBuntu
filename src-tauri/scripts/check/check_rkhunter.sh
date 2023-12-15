#!/bin/bash

# Check if RKHunter is installed
if ! command -v rkhunter > /dev/null 2>&1; then
  echo "{\"enabled\": false}"
  exit 0
fi

# Update RKHunter (uncomment the line below if you want to include the update step)
# sudo rkhunter --update

# Print status
echo "{\"enabled\": true}"

