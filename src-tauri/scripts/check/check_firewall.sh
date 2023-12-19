#!/bin/bash

if ! sudo ufw status | grep -qi 'Status: active'; then
  echo "{\"enabled\": false}"
  exit 0
fi
if ! sudo ufw status | grep -qi '22/tcp.*ALLOW'; then
  echo "{\"enabled\": false}"
  exit 0
fi
if ! sudo ufw status | grep -qi '443/tcp.*ALLOW'; then
  echo "{\"enabled\": false}"
  exit 0
fi
echo "{\"enabled\": true}"
