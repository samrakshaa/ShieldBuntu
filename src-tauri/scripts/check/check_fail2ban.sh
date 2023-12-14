#!/bin/bash

# Check if Fail2Ban is installed
if ! command -v fail2ban-client > /dev/null 2>&1; then
  echo "{\"fail2ban_status\": \"0\"}"  # Fail2Ban is not installed
  exit 1
fi

# Check if Fail2Ban service is running
fail2ban_running=$(sudo systemctl is-active fail2ban | grep -qi 'active'; echo $?)

echo "{\"fail2ban_status\": \"$((!fail2ban_running))\"}"
