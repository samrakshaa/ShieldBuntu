#!/bin/bash

if command -v deborphan > /dev/null 2>&1; then
  echo "{\"enabled\": true}"
else
  echo "{\"enabled\": false}"
fi
