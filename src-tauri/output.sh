#!/bin/bash



( sleep 2 && echo -e '================= Firewall Config (L2) =========='
#!/bin/bash

configure_default_rules() {
    sudo ufw default deny incoming
    sudo ufw default deny outgoing
    sudo ufw default deny routed
    sudo ufw allow 443/tcp
    sudo ufw allow 22/tcp
    sudo ufw deny in from 127.0.0.0/8
    sudo ufw deny in from ::1
    sudo ufw allow in on lo
    sudo ufw allow out on lo
    echo "yes" | sudo ufw enable
    sudo ufw logging on
    echo "Default UFW configuration complete."
}

configure_custom_rules() {
    read -p "Enter resource (port or IP): " resource
    read -p "Enter option (a to allow, d to deny): " opt

    # Check if the resource is an IP or a port
    if [[ "$resource" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        # IP address provided
        if [ "$opt" == "a" ]; then
            sudo ufw allow from "$resource" to any
        elif [ "$opt" == "d" ]; then
            sudo ufw deny from "$resource" to any
        else
            echo "Invalid option. Please provide 'a' to allow or 'd' to deny."
            exit 1
        fi
    else
        # Port number provided
        if [ "$opt" == "a" ]; then
            sudo ufw allow "$resource"/tcp
        elif [ "$opt" == "d" ]; then
            sudo ufw deny "$resource"/tcp
        else
            echo "Invalid option. Please provide 'a' to allow or 'd' to deny."
            exit 1
        fi
    fi

    echo "Custom UFW configuration complete."
}

view_rules() {
    sudo ufw status verbose
}

enable_disable_firewall() {
    read -p "Enter option (e to enable, d to disable): " opt
    case $opt in
        e)
            sudo ufw enable
            echo "Firewall enabled."
            ;;
        d)
            sudo ufw disable
            echo "Firewall disabled."
            ;;
        *)
            echo "Invalid option. Please provide 'e' to enable or 'd' to disable."
            exit 1
            ;;
    esac
}

# Main menu
while true; do
    echo "UFW Configuration Menu:"
    echo "1. Default Rules"
    echo "2. Customized Rules"
    echo "3. View Rules/Check Firewall Status"
    echo "4. Enable/Disable Firewall"
    echo "5. Exit"
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            configure_default_rules
            ;;
        2)
            configure_custom_rules
            ;;
        3)
            view_rules
            ;;
        4)
            enable_disable_firewall
            ;;
            
        5)  
            echo "Exiting UFW Configuration Menu."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please enter a number between 1 and 4."
            ;;
    esac
done
sleep 2 )



( sleep 2 && echo -e '================= Get Logs (L1) ================='
#!/bin/bash

echo -e '============== Extracting Logs =============='
mkdir ~/logs
sudo cat /var/log/syslog > ~/logs/syslog.txt
sudo dmesg > ~/logs/kernellog.txt
sudo cat /var/log/auth.log > ~/logs/authlogs.txt
echo -e '============ Saved in Home/Logs folder ======='
sleep 2 )


