#!/bin/bash

echo "Installing and configuring Fail2Ban..."
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
echo "Fail2Ban installation and configuration completed."