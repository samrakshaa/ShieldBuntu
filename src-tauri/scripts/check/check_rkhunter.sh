#!/bin/bash

# Check if RKHunter is installed
if ! command -v rkhunter > /dev/null 2>&1; then
  echo "{\"rkhunter_status\": \"0\"}"  # RKHunter is not installed
  exit 1
fi

# Update RKHunter
# sudo rkhunter --update

# Print fixed status
echo "{\"rkhunter_status\": \"1\"}"
