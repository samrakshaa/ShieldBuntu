#!/bin/bash

# Check if UFW is installed
if ! command -v ufw > /dev/null 2>&1; then
  echo "UFW is not installed."
  exit 1
fi

# Check if UFW is enabled
ufw_enabled=$(sudo ufw status | grep -qi 'Status: active'; echo $?)

# Check if the specific rules are already applied
ssh_rule=$(sudo ufw status | grep -qi '22/tcp'; echo $?)
https_rule=$(sudo ufw status | grep -qi '443/tcp'; echo $?)

# echo {"firewall" : {"ufw_enabled": "$((!ufw_enabled))", "ssh_rule": "$((!ssh_rule))", "https_rule": "$((!https_rule))"}}

echo "{\"firewall\" : {\"ufw_enabled\": \"$((!ufw_enabled))\", \"ssh_rule\": \"$((!ssh_rule))\", \"https_rule\": \"$((!https_rule))\"}}"