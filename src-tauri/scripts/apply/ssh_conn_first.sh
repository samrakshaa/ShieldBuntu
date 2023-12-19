#!/bin/bash

user="$SUDO_USER"
employee_user="$1"
employee_ip="$2"
employee_password="$3"
#skh190802#
user_home="/home/$user"  
sudo ssh-keygen -f "$user_home/.ssh/known_hosts" -R "$employee_ip"
sudo chmod 700 $user_home/.ssh
# Generate SSH key pair if not already exists
if [ ! -f "$user_home/.ssh/id_rsa" ]; then
    sudo ssh-keygen -t rsa -b 2048 -f "$user_home/.ssh/id_rsa" -N "" -y
fi
sudo chmod 700 $user_home/.ssh
sudo chmod 600 "$user_home/.ssh/id_rsa"
sudo chmod 777 "$user_home/.ssh/id_rsa.pub"
echo "Executing ssh-copy-id command"
echo "$employee_password" | sshpass -p "$employee_password" ssh-copy-id -i "$user_home/.ssh/id_rsa.pub" "$employee_user@$employee_ip"

# echo "Testing the SSH connection with a timeout of 10 seconds"
sudo ssh -o StrictHostKeyChecking=no -i "$user_home/.ssh/id_rsa" "$employee_user@$employee_ip" echo "SSH connection established successfully."

echo "Script execution completed"

# sshpass -p "$employee_password" sudo ssh -i ~/.ssh/id_rsa $employee_user@$employee_ip