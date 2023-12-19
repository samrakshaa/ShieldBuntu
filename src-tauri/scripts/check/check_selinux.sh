#!/bin/bash

selinux_state="false"
if dpkg -l | grep -qw selinux-utils; then
    if [ -f /etc/selinux/config ]; then
        SELINUX_STATUS=$(grep "^SELINUX=" /etc/selinux/config | cut -d'=' -f2)
        if [ "$SELINUX_STATUS" = "enforcing" ] || [ "$SELINUX_STATUS" = "permissive" ]; then
            selinux_state="true"
        fi
    fi
fi

echo "{\"enabled\": \"$selinux_state\"}"
