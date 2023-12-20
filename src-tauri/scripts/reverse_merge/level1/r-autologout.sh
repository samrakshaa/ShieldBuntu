#!/bin/bash

# Check if TMOUT is set in /etc/profile
if grep -q "export TMOUT=" /etc/profile; then
    # Undo the changes made by the original script
    sudo sed -i "/export TMOUT=/d" /etc/profile
    echo "Auto-logout duration has been removed."
else
    echo "Auto-logout duration was not set by the original script."
fi
