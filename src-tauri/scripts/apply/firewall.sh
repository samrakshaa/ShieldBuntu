#!/bin/bash

if [ "$#" -eq 2 ]; then
    port=$1
    opt=$2

    if [ "$opt" == "a" ]; then
        sudo ufw allow "$port"/tcp
    elif [ "$opt" == "d" ]; then
        sudo ufw deny "$port"/tcp
    else
        echo "Invalid option. Please provide 'a' to allow or 'r' to deny."
        exit 1
    fi
    
elif [ "$#" -eq 0 ]; then
    sudo ufw default allow outgoing
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
    sudo ufw deny in from 127.0.0.0/8
    sudo ufw deny in from ::1
    sudo ufw deny in from any to any icmp
else
    echo "Invalid number of parameters. Usage: $0 [port] [a/r]"
    exit 1
fi

echo "yes" | sudo ufw enable
sudo ufw logging on
echo "UFW configuration complete."