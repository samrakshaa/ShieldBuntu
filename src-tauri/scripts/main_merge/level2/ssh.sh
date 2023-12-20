#!/bin/bash

echo "Securing SSH configuration..."

sshd_config_path="/etc/ssh/sshd_config"
backup_file="$sshd_config_path.bak"

backup_ssh_config() {
    if [ ! -e "$backup_file" ]; then
        sudo cp "$sshd_config_path" "$backup_file"
    fi
}

update_ssh_config() {
    local option=$1
    case $option in
        1) sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' "$sshd_config_path" ;;
        2) sudo sed -i 's/#PermitEmptyPasswords no/PermitEmptyPasswords no/' "$sshd_config_path" ;;
        3) sudo sed -i 's/#PermitUserEnvironment no/PermitUserEnvironment no/' "$sshd_config_path" ;;
        4) sudo sed -i 's/X11Forwarding yes/X11Forwarding no/' "$sshd_config_path" ;;
        5) sudo sed -i 's/#AllowTcpForwarding yes/AllowTcpForwarding no/' "$sshd_config_path" ;;
        6) read -p "Enter a new SSH port number: " new_port
           sudo sed -i "s/#Port 22/Port $new_port/" "$sshd_config_path"
           sudo ufw allow in "$new_port"
           sudo ufw allow out "$new_port" ;;
        *) echo "Invalid option." ;;
    esac
}

restore_original_config() {
    if [ -e "$backup_file" ]; then
        sudo cp "$backup_file" "$sshd_config_path"
        echo "Original SSH configuration restored."
        restart_ssh_service
        exit
    else
        echo "Backup file not found. Unable to restore original configuration."
    fi
}

restart_ssh_service() {
    if command -v systemctl &> /dev/null; then
        sudo systemctl restart ssh
    elif command -v service &> /dev/null; then
        sudo service ssh restart
    else
        echo "Unable to restart SSH service. Please restart it manually."
    fi
}

while :
do
    echo "SSH Hardening Options:"
    echo "1. Disable Password Authentication"
    echo "2. Disable Empty Passwords"
    echo "3. Disable User Environment"
    echo "4. Disable X11 Forwarding"
    echo "5. Disable TCP Forwarding"
    echo "6. Change SSH Port"
    echo "7. Apply Hardening and Restart SSH"
    echo "8. Restore Original SSH Configuration"
    echo "9. Exit"

    read -p "Enter your choice (1-9): " choice

    case $choice in
        1|2|3|4|5|6) update_ssh_config "$choice";;
        7) backup_ssh_config
           restart_ssh_service
           echo "SSH hardening complete."
           exit ;;
        8) restore_original_config ;;
        9) exit ;;
        *) echo "Invalid choice. Please enter a number between 1 and 9." ;;
    esac
done