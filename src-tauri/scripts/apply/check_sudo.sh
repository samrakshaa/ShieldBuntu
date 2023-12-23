#!/bin/bash

root_users=$(grep -c '^root:' /etc/passwd)
current_user=$(whoami)
if [ "$root_users" -gt 1 ]; then
    echo "Multiple root users found. Modifying user privileges for security."
    for user in $(awk -F':' '$3 == 0 {print $1}' /etc/passwd | grep -v "$current_user"); do
        usermod -G "$user" "$user"
    done

    echo false
    exit 0
else
    echo true
    exit 0
fi