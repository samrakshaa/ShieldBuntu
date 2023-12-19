#!/bin/bash

echo "Installing and configuring ClamAV..."

if ! command -v clamscan &> /dev/null; then
    sudo apt install clamav clamav-daemon -y
fi
if ! pgrep -x "freshclam" > /dev/null; then
    sudo freshclam
fi
if ! systemctl is-enabled clamav-daemon &> /dev/null; then
    sudo systemctl enable clamav-daemon
fi
if ! systemctl is-active --quiet clamav-daemon; then
    sudo systemctl start clamav-daemon
fi

echo "ClamAV installation and configuration completed."