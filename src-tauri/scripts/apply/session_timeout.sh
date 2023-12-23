#!/bin/bash

TIMEOUT_DURATION=$1
if grep -q "export TMOUT=" /etc/profile; then
    sudo sed -i "/export TMOUT=/c\export TMOUT=$TIMEOUT_DURATION" /etc/profile
else
    echo "export TMOUT=$TIMEOUT_DURATION" | sudo tee -a /etc/profile
fi
echo "Auto-logout after $TIMEOUT_DURATION seconds of inactivity is now set."