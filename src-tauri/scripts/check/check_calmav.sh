#!/bin/bash

if ! command -v clamscan > /dev/null 2>&1; then
  echo "{\"enabled\": false}"
  exit 0
fi
clamav_daemon_running=$(sudo systemctl is-active clamav-daemon | grep -qi 'active'; echo $?)
if (( clamav_daemon_running == 0 )); then
  echo "{\"enabled\": true}"
else
  echo "{\"enabled\": false}"
fi