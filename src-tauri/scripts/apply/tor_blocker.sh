#!/bin/bash

# Function to check if an IP address is IPv4 or IPv6
is_ipv6() {
  [[ "$1" == *:* ]]
}

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

# Function to block IP addresses using iptables
block_ip_addresses() {
  local file="$1"
  while IFS= read -r ip; do
    if is_ipv6 "$ip"; then
      ip6tables -A INPUT -s "$ip" -j DROP
      ip6tables -A OUTPUT -d "$ip" -j DROP
    else
      iptables -A INPUT -s "$ip" -j DROP
      iptables -A OUTPUT -d "$ip" -j DROP
    fi
    echo "Blocked IP address: $ip"
  done < "$file"
}

block_tor_ports() {
  # Block Tor ports
  sudo ufw deny 9000     # Tor ORPort
  sudo ufw deny 9001
  sudo ufw deny 9030     # Tor DirPort
  sudo ufw deny 9050     # Tor SOCKS Port
  sudo ufw deny 9051     # Tor Control Port
}
# Function to create iptables rule files and directories if they don't exist
create_iptables_files() {
  local ipv4_file="/etc/iptables/rules.v4"
  local ipv6_file="/etc/iptables/rules.v6"

  local ipv4_dir=$(dirname "$ipv4_file")
  local ipv6_dir=$(dirname "$ipv6_file")

  # Create directories if they don't exist
  mkdir -p "$ipv4_dir"
  mkdir -p "$ipv6_dir"

  # Create iptables rule files if they don't exist
  touch "$ipv4_file"
  touch "$ipv6_file"

  echo "Created $ipv4_file"
  echo "Created $ipv6_file"
}

# Function to install iptables and iptables-persistent if not present
install_iptables() {
  if ! command -v iptables &> /dev/null; then
    echo "Installing iptables..."
    apt-get update
    apt-get install -y --reinstall iptables
  fi

  if ! command -v iptables-save &> /dev/null; then
    echo "Installing iptables-persistent..."
    apt-get install -y iptables-persistent
  fi

  # Ensure iptables service is enabled if the package is installed
  if [ -x /etc/init.d/iptables ]; then
    update-rc.d iptables enable
  fi
}

# Function to reload iptables rules
reload_iptables_rules() {
  # Check if iptables-persistent is installed
  if command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q iptables; then
    systemctl restart iptables
  else
    # Reload iptables rules using appropriate command
    iptables-restore < /etc/iptables/rules.v4
    ip6tables-restore < /etc/iptables/rules.v6
  fi
}

# Function to clean up temporary files
cleanup() {
  rm -f "merged_list.txt" "tor_full_list.txt" "tor_exit_list.txt"
  # echo "Temporary files cleaned up."
}

# Main function to execute blocking measures
main() {
  # Check if the script is run as root
  if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)." >&2
    exit 1
  fi

  # Install iptables and iptables-persistent if not present
  install_iptables

  # Download Tor node lists
  download_tor_nodes "https://www.dan.me.uk/torlist/?full" "tor_full_list.txt"
  download_tor_nodes "https://www.dan.me.uk/torlist/?exit" "tor_exit_list.txt"

  # Merge and deduplicate IP addresses
  merge_and_deduplicate "tor_full_list.txt" "tor_exit_list.txt"

  # Create iptables rule files if they don't exist
  create_iptables_files

  # Block IP addresses from the merged list
  block_ip_addresses "merged_list.txt"

  # Reload iptables rules
  reload_iptables_rules

  block_tor_ports
  # Clean up temporary files
  cleanup

  echo "IP blocking measures have been applied."
}

# Run the main function
main