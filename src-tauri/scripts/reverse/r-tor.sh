#!/bin/bash

# Function to download Tor node list from URL
download_tor_nodes() {
  local url="$1"
  local output_file="$2"
  curl -sSL "$url" >> "$output_file"
}

# Function to merge and deduplicate IP addresses from two files
merge_and_deduplicate() {
  local file1="$1"
  local file2="$2"
  sort -u "$file1" "$file2" > merged_list.txt
}

# Function to check if an IP address is IPv4 or IPv6
is_ipv6() {
  [[ "$1" == *:* ]]
}

# Function to unblock IP addresses using iptables
unblock_ip_addresses() {
  local file="$1"
  while IFS= read -r ip; do
    if is_ipv6 "$ip"; then
      ip6tables -D INPUT -s "$ip" -j DROP
      ip6tables -D OUTPUT -d "$ip" -j DROP
    else
      iptables -D INPUT -s "$ip" -j DROP
      iptables -D OUTPUT -d "$ip" -j DROP
    fi
    # echo "Unblocked IP address: $ip"
  done < "$file"
}

ensure_ufw_enabled() {
  if ! command -v ufw &> /dev/null; then
    echo "Installing ufw..."
    sudo apt-get update
    sudo apt-get install -y ufw
  fi

  if ! sudo ufw status | grep -q "Status: active"; then
    echo "Enabling ufw..."
    sudo ufw enable
    echo "ufw has been enabled."
  fi
}

# Function to remove UFW rules blocking Tor ports
unblock_tor_ports() {
  ufw delete deny 9001     # Tor ORPort
  ufw delete deny 9030     # Tor DirPort
  ufw delete deny 9050     # Tor SOCKS Port
  ufw delete deny 9051     # Tor Control Port
  ufw delete deny 9000
  ufw delete deny 9150
  ufw delete deny 9040
}

# Function to reload UFW rules
reload_ufw_rules() {
  sudo ufw reload
}

# Function to clean up temporary files
cleanup() {
  rm -f "merged_list.txt" "tor_full_list.txt" "tor_exit_list.txt"
}

# Main function to execute unblocking measures
main() {
  # Check if the script is run as root
  if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)." >&2
    exit 1
  fi

  # Download Tor node lists
  download_tor_nodes "https://www.dan.me.uk/torlist/?full" "tor_full_list.txt"
  download_tor_nodes "https://www.dan.me.uk/torlist/?exit" "tor_exit_list.txt"

  # Merge and deduplicate IP addresses
  merge_and_deduplicate "tor_full_list.txt" "tor_exit_list.txt"

  # Unblock IP addresses from the merged list
  unblock_ip_addresses "merged_list.txt"

  ensure_ufw_enabled

  # Remove UFW rules blocking Tor ports
  unblock_tor_ports

  # Reload UFW rules
  reload_ufw_rules

  # Clean up temporary files
  cleanup

  echo "IP unblocking measures have been applied."
}

# Run the main function
main