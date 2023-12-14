#!/bin/bash

# Check if script is run with root privileges
if [ "$EUID" -ne 0 ]; then
    echo "{\"security_tools_status\": \"0\", \"message\": \"Please run this script as root or using sudo.\"}"
    exit 1
fi

# Function to check if a tool is installed
check_tool() {
    local tool="$1"
    if command -v "$tool" > /dev/null 2>&1; then
        return 1  # Tool is installed
    else
        return 0  # Tool is not installed
    fi
}

# List of security tools
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

# Check if each tool is installed and print the status
for tool in "${security_tools[@]}"; do
    check_tool "$tool"
    status=$?
    echo "{\"$tool\": \"$status\"}"
done
