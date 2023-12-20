#!/bin/bash

# Log file location
LOG_FILE="/var/log/audit.log"

# Function to log messages to the audit log and print to the console
log() {
  local message="$1"
  echo "$(date '+%Y-%m-%d %H:%M:%S') $message" >> "$LOG_FILE"
  echo "$message"
}

# Function to check and log user accounts
check_users() {
  log "Checking user accounts:"
  cat /etc/passwd | awk -F: '{ print "User: " $1 ", UID: " $3 ", Home: " $6 }' >> "$LOG_FILE"
}

# Function to check and log file integrity
check_file_integrity() {
  log "Checking file integrity:"
  find /etc -type f -exec md5sum {} \; >> "$LOG_FILE"
}

# Function to check and log SSH configuration
check_ssh_config() {
  log "Checking SSH configuration:"
  grep -E "PermitRootLogin|PasswordAuthentication" /etc/ssh/sshd_config >> "$LOG_FILE"
}

# Function to check and log firewall settings
check_firewall() {
  log "Checking firewall settings:"
  iptables -L -n >> "$LOG_FILE"
}

# Function to check and log basic system information
check_system_info() {
  log "Checking basic system information:"
  uname -a >> "$LOG_FILE"
  df -h >> "$LOG_FILE"
  free -m >> "$LOG_FILE"
  ifconfig >> "$LOG_FILE"
  lsblk >> "$LOG_FILE"
}

# Function to check and log open ports
check_open_ports() {
  log "Checking open ports:"
  ss -tuln >> "$LOG_FILE"
}

# Function to check and log running processes
check_processes() {
  log "Checking running processes:"
  ps aux >> "$LOG_FILE"
}

# Function to check and log listening network services
check_network_services() {
  log "Checking listening network services:"
  netstat -tuln >> "$LOG_FILE"
}

# Function to check and log user login history
check_login_history() {
  log "Checking user login history:"
  last >> "$LOG_FILE"
}

# Function to check and log system logs
check_system_logs() {
  log "Checking system logs:"
  cat /var/log/syslog >> "$LOG_FILE"
  cat /var/log/auth.log >> "$LOG_FILE"
}

# Function to extract logs and print to the console
extract_logs() {
  log "Extracting logs:"
  cat "$LOG_FILE"
}

# Main menu
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

  main_menu
}

# Main function
main() {
  # Run the main menu
  main_menu
}

# Run the script
main