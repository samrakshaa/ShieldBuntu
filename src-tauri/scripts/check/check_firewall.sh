#!/bin/bash

# Check if UFW is installed and active
if ! sudo ufw status | grep -qi 'Status: active'; then
  echo "{\"enabled\": false}"
  exit 0
fi

# Check if SSH rule is enabled
if ! sudo ufw status | grep -qi '22/tcp.*ALLOW'; then
  echo "{\"enabled\": false}"
  exit 0
fi

# Check if HTTPS rule is enabled
if ! sudo ufw status | grep -qi '443/tcp.*ALLOW'; then
  echo "{\"enabled\": false}"
  exit 0
fi

# If all checks pass, return true
echo "{\"enabled\": true}"
