#!/bin/bash

# Check if ClamAV is installed
if ! command -v clamscan > /dev/null 2>&1; then
  echo "{\"clamav_status\": \"0\"}"  # ClamAV is not installed
  exit 1
fi

# Check if ClamAV daemon is running
clamav_daemon_running=$(sudo systemctl is-active clamav-daemon | grep -qi 'active'; echo $?)

echo "{\"clamav_status\": \"$((!clamav_daemon_running))\"}"
