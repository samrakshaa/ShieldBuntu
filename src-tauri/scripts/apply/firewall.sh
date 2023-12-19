#!/bin/bash

sudo ufw default allow outgoing
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw deny in from 127.0.0.0/8
sudo ufw deny in from ::1
sudo ufw deny in from any to any icmp
echo "yes" | sudo ufw enable
sudo ufw logging on
echo "UFW configuration complete."