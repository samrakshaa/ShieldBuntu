#!/bin/bash

# Check if AppArmor is installed
if ! command -v apparmor_status > /dev/null 2>&1; then
  echo "{\"apparmor_status\": \"0\"}"  # AppArmor is not installed
  exit 1
fi

# Check AppArmor status
apparmor_enabled=$(sudo apparmor_status | grep -qi 'apparmor module is loaded.'; echo $?)

echo "{\"apparmor_status\": \"$((!apparmor_enabled))\"}"
