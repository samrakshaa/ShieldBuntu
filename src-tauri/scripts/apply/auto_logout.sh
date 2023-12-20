#!/bin/bash

read -p "Enter timeout duration (in seconds): " TIMEOUT_DURATION

if grep -q "export TMOUT=" /etc/profile; then
    sudo sed -i "/export TMOUT=/c\export TMOUT=$TIMEOUT_DURATION" /etc/profile
else
    echo "export TMOUT=$TIMEOUT_DURATION" | sudo tee -a /etc/profile
fi

echo "Auto-logout after $TIMEOUT_DURATION seconds of inactivity is now set."