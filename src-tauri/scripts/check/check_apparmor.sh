#!/bin/bash

if ! command -v apparmor_status > /dev/null 2>&1; then
  echo "{\"enabled\": false}"
  exit 0
fi

apparmor_enabled=$(sudo apparmor_status | grep -qi 'apparmor module is loaded.'; echo $?)

echo "{\"enabled\": $((!apparmor_enabled))}"
