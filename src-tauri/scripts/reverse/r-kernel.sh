#!/bin/bash

if [ -e /etc/sysctl.conf.bak ]; then
    # Restore the original sysctl.conf file
    cp /etc/sysctl.conf.bak /etc/sysctl.conf

    sysctl -p

    echo "Kernel hardening configuration reverted successfully!"
else
    echo "Backup file (/etc/sysctl.conf.bak) not found. No changes reverted."
fi