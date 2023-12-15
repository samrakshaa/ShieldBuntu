#!/bin/bash

# Function to check if an IP address is IPv4 or IPv6
is_ipv6() {
  [[ "$1" == *:* ]]
}

# Function to download Tor node list from URL
download_tor_nodes() {
  local url="$1"
  local output_file="$2"
  curl -sSL "$url" > "$output_file"
}

# Function to merge and deduplicate IP addresses from two files
merge_and_deduplicate() {
  local file1="$1"
  local file2="$2"
  local merged_list="/var/log/merged_list.txt"
  sort -u "$file1" "$file2" > "$merged_list"
}

# Function to unblock Tor ports
unblock_tor_ports() {
  # Allow Tor ports
  ufw delete deny 9001     # Tor ORPort
  ufw delete deny 9030     # Tor DirPort
  ufw delete deny 9050     # Tor SOCKS Port
  ufw delete deny 9051     # Tor Control Port
  ufw delete deny 9000
  ufw delete deny 9150
  ufw delete deny 9040
}

# Function to remove iptables rules blocking IP addresses
unblock_ip_addresses() {
  local file="$1"
  while IFS= read -r ip; do
    if is_ipv6 "$ip"; then
      sudo ip6tables -D INPUT -s "$ip" -j DROP
      sudo ip6tables -D OUTPUT -d "$ip" -j DROP
    else
      sudo iptables -D INPUT -s "$ip" -j DROP
      sudo iptables -D OUTPUT -d "$ip" -j DROP
    fi
    # echo "Unblocked IP address: $ip"
  done < "$file"
}

# Function to reload iptables rules
reload_iptables_rules() {
  # Check if iptables-persistent is installed
  if command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q iptables; then
    sudo systemctl restart iptables
  else
    # Reload iptables rules using appropriate command
    sudo iptables-restore < /etc/iptables/rules.v4
    sudo ip6tables-restore < /etc/iptables/rules.v6
  fi
}

# Function to clean up temporary files
cleanup() {
  sudo rm -f "/var/log/tor_full_list.txt" "/var/log/tor_exit_list.txt" "/var/log/merged_list.txt"
}

# Main function to execute unblocking measures
unblock_main() {
  # Check if the script is run as root
  if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)." >&2
    exit 1
  fi

  # Download fresh Tor node lists
  download_tor_nodes "https://www.dan.me.uk/torlist/?full" "/var/log/tor_full_list.txt"
  download_tor_nodes "https://www.dan.me.uk/torlist/?exit" "/var/log/tor_exit_list.txt"

  # Merge and deduplicate IP addresses
  merge_and_deduplicate "/var/log/tor_full_list.txt" "/var/log/tor_exit_list.txt"

  # Unblock Tor ports
  unblock_tor_ports

  # Unblocking IP addresses from the merged list
  unblock_ip_addresses "/var/log/merged_list.txt"

  # Reload iptables rules
  reload_iptables_rules

  # Clean up temporary files
  cleanup

  echo "IP unblocking measures have been applied."
}

# Run the unblock_main function
unblock_main
