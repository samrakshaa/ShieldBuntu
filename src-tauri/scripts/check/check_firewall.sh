#!/bin/bash

if ! sudo ufw status | grep -iw 'Status: active' &> /dev/null; then
  echo false
  exit 0
fi

echo true
