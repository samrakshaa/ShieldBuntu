#!/bin/bash

# Script to reset SELinux on Ubuntu

# Check if SELinux is installed
dpkg -l | grep selinux-utils

if [ $? -eq 0 ]; then
    # Check if SELinux is enabled
    if [ -f /etc/selinux/config ]; then
        grep -qE '^SELINUX=disabled' /etc/selinux/config

        if [ $? -eq 0 ]; then
            echo "SELinux is already disabled. No further action needed."
        else
            # Set SELinux to disabled mode
            sudo sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

            # Reboot the system to apply SELinux changes
            echo "SELinux disabled. Rebooting the system to apply changes."
            sudo reboot
        fi
    else
        echo "SELinux configuration file not found. Please check if SELinux is installed correctly."
    fi
else
    echo "SELinux is not installed. No changes made."
fi