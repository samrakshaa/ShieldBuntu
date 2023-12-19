#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "{\"enabled\": false, \"message\": \"Please run this script as root or using sudo.\"}"
    exit 1
fi
check_tool() {
    local tool="$1"
    if command -v "$tool" > /dev/null 2>&1; then
        return 1  # Tool is installed
    else
        return 0  # Tool is not installed
    fi
}

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
for tool in "${security_tools[@]}"; do
    check_tool "$tool"
    status=$?
    echo "{\"$tool\": $((!status))}"
done
