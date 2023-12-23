#!/bin/bash

LOG_FILE="/var/log/audit.log"

log() {
  local message="$1"
  echo "$(date '+%Y-%m-%d %H:%M:%S') $message" >> "$LOG_FILE"
  echo "$message"
}
check_users() {
  echo "Checking user accounts:"
  cat /etc/passwd | awk -F: '{ print "User: " $1 ", UID: " $3 ", Home: " $6 }'
}

check_file_integrity() {
  echo "Checking file integrity:"
  find /etc -type f -exec md5sum {} \;
}

check_ssh_config() {
  echo "Checking SSH configuration:"
  grep -E "PermitRootLogin|PasswordAuthentication" /etc/ssh/sshd_config
}

check_firewall() {
  echo "Checking firewall settings:"
  iptables -L -n
}

check_system_info() {
  echo "Checking basic system information:"
  uname -a
  df -h
  free -m
  ifconfig
  lsblk
}

check_open_ports() {
  echo "Checking open ports:"
  ss -tuln
}

check_processes() {
  echo "Checking running processes:"
  ps aux
}

check_network_services() {
  echo "Checking listening network services:"
  netstat -tuln
}

check_login_history() {
  echo "Checking user login history:"
  if [ -e /var/log/wtmp ]; then
    last
  elif [ -e /var/run/utmp ]; then
    last -f /var/run/utmp
  elif command -v lastlog &> /dev/null; then
    lastlog
  else
    echo "Error: Login history not available."
  fi
}


check_system_logs() {
  echo "Checking system logs:"
  sudo dmesg
  sudo dmesg > cat $LOG_FILE
}

extract_logs() {
  echo "Extracting logs:"
  cat "$LOG_FILE"
}

main_menu() {
  echo "===== System Audit Menu ====="
  echo "1. Check User Accounts"
  echo "2. Check File Integrity"
  echo "3. Check SSH Configuration"
  echo "4. Check Firewall Settings"
  echo "5. Check System Information"
  echo "6. Check Open Ports"
  echo "7. Check Running Processes"
  echo "8. Check Network Services"
  echo "9. Check User Login History"
  echo "10. Check System Logs"
  echo "11. Extract and Print Logs"
  echo "12. Exit"

  read -p "Enter your choice (1-12): " choice
  case $choice in
    1) check_users ;;
    2) check_file_integrity ;;
    3) check_ssh_config ;;
    4) check_firewall ;;
    5) check_system_info ;;
    6) check_open_ports ;;
    7) check_processes ;;
    8) check_network_services ;;
    9) check_login_history ;;
    10) check_system_logs ;;
    11) extract_logs ;;
    12) exit ;;
    *) echo "Invalid choice. Please enter a number between 1 and 12." ;;
  esac
}

main() {
  while :
  do
    main_menu
  done
}

main