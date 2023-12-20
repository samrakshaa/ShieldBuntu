#!/bin/bash

read -p "Enter timeout duration (in seconds): " TIMEOUT_DURATION

# Set or update TMOUT value in /etc/profile
sudo sed -i "/export TMOUT=/c\export TMOUT=$TIMEOUT_DURATION" /etc/profile

echo "Auto-logout after $TIMEOUT_DURATION seconds of inactivity is now set."