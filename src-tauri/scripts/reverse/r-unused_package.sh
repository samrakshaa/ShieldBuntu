#!/bin/bash

if command -v deborphan > /dev/null 2>&1; then
  echo "Uninstalling Deborphan..."
  sudo apt-get remove --purge deborphan -y
  echo "Deborphan uninstalled."
else
  echo "Deborphan is not installed."
fi
