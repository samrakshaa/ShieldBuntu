#!/bin/bash

# Script to revert kernel parameter changes for increased security

# Check if the backup file exists
if [ -e /etc/sysctl.conf.bak ]; then
    # Restore the original sysctl.conf file
    cp /etc/sysctl.conf.bak /etc/sysctl.conf

    # Apply the original settings
    sysctl -p

    echo "Kernel hardening configuration reverted successfully!"
else
    echo "Backup file (/etc/sysctl.conf.bak) not found. No changes reverted."
fi