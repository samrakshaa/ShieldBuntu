#!/bin/bash

# Initialize the SELinux state as false
selinux_state="false"

# Check if SELinux utilities are installed
if dpkg -l | grep -qw selinux-utils; then

    # Check if the SELinux configuration file exists
    if [ -f /etc/selinux/config ]; then

        # Check the SELinux status
        SELINUX_STATUS=$(grep "^SELINUX=" /etc/selinux/config | cut -d'=' -f2)

        if [ "$SELINUX_STATUS" = "enforcing" ] || [ "$SELINUX_STATUS" = "permissive" ]; then
            # SELinux is enabled
            selinux_state="true"
        fi
    fi
fi

# Output the SELinux state in JSON format
echo "{\"selinux_state\": \"$selinux_state\"}"
