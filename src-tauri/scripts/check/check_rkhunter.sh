#!/bin/bash

if ! command -v rkhunter > /dev/null 2>&1; then
  echo "{\"enabled\": false}"
  exit 0
fi
echo "{\"enabled\": true}"

