#!/bin/bash

# Check if the required number of arguments are provided
if [ "$#" -ne 5 ]; then
    echo "Usage: $0 <username> <ip> <password> <script_path> <script_name>"
    echo "  <username>: Remote username to connect to."
    echo "  <ip>: Remote IP address or hostname."
    echo "  <password>: Password for remote user's sudo access."
    echo "  <script_path>: Path to the directory containing the script."
    echo "  <script_name>: Name of the script to be executed on the remote machine."
    exit 1
fi

username="$1"
ip="$2"
pass="$3"
script_path="$4"
script_name="$5"

sudo scp -i ~/.ssh/id_rsa $script_path/$script_name $username@$ip:~

sudo ssh -t -i ~/.ssh/id_rsa $username@$ip "
       chmod +x ~/$script_name
       echo '$pass' | sudo -S ~/$script_name
       exit_status=\$?
       rm -rf ~/$script_name
       exit \$exit_status"
       
if [ $? -eq 0 ]; then
    echo "Script executed successfully."
else
    echo "Error: Script execution failed."
fi