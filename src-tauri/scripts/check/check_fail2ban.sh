#!/bin/bash

# Check if Fail2Ban is installed
if ! command -v fail2ban-client > /dev/null 2>&1; then
  echo "{\"enabled\": false}"
  exit 0
fi

# Check if Fail2Ban service is running
fail2ban_running=$(sudo systemctl is-active fail2ban | grep -qi 'active'; echo $?)

if (( fail2ban_running == 0 )); then
  echo "{\"enabled\": true}"
else
  echo "{\"enabled\": false}"
fi
