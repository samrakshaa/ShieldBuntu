#!/bin/bash

print_tmout() {
    local tmout_value=$(grep "export TMOUT=" /etc/profile | cut -d'=' -f2)
    if [ -n "$tmout_value" ]; then
        echo "$tmout_value"
    else
        echo "False"
    fi
}

print_tmout


