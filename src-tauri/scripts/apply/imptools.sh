#!/bin/bash

# Check if script is run with root privileges
if [ "$EUID" -ne 0 ]; then
    echo "Please run this script as root or using sudo."
    exit 1
fi

# Update package lists
apt update

# Function to install security tools
install_tool() {
    local tool="$1"
    apt install -y "$tool"
}

# List of available security tools
security_tools=(
    "net-tools"
    "nmap"
    "nikto"
    "lynis"
    "chkrootkit"
    "rkhunter"
    "clamav"
    "clamtk"
    "aide"
    "fail2ban"
    "iptables"
    "apparmor"
    "auditd"
    "openvpn"
    "tcpdump"
    "wireshark"
    "htop"
    "curl"
    "wget"
    "vim"
    "tmux"
    "git"
)

# Install selected security tools
for tool in "${security_tools[@]}"; do
    if [[ "$#" -eq 0 || "$*" == *"$tool"* ]]; then
        install_tool "$tool"
    fi
done

echo "Security tools installation completed."