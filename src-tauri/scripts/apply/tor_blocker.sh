#!/bin/bash

# Function to check if an IP address is IPv4 or IPv6
is_ipv6() {
  [[ "$1" == *:* ]]
}

block_tor_ports() {
  # Block Tor ports
  ufw deny 9001     # Tor ORPort
  ufw deny 9030     # Tor DirPort
  ufw deny 9050     # Tor SOCKS Port
  ufw deny 9051     # Tor Control Port
  ufw deny 9000
  ufw deny 9150
  ufw deny 9040
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
  local merged_list="/var/log/merged_list.txt"
  sort -u "$file1" "$file2" > "$merged_list"
}


# Function to block IP addresses using iptables
block_ip_addresses() {
  local file="$1"
  while IFS= read -r ip; do
    if is_ipv6 "$ip"; then
      sudo ip6tables -A INPUT -s "$ip" -j DROP
      sudo ip6tables -A OUTPUT -d "$ip" -j DROP
    else
      sudo iptables -A INPUT -s "$ip" -j DROP
      sudo iptables -A OUTPUT -d "$ip" -j DROP
    fi
    # echo "Blocked IP address: $ip"
  done < "$file"
}

# Function to create iptables rule files and directories if they don't exist
create_iptables_files() {
  local ipv4_file="/etc/iptables/rules.v4"
  local ipv6_file="/etc/iptables/rules.v6"

  local ipv4_dir=$(dirname "$ipv4_file")
  local ipv6_dir=$(dirname "$ipv6_file")

  # Create directories if they don't exist
  sudo mkdir -p "$ipv4_dir"
  sudo mkdir -p "$ipv6_dir"

  # Create iptables rule files if they don't exist
  sudo touch "$ipv4_file"
  sudo touch "$ipv6_file"

  echo "Created $ipv4_file"
  echo "Created $ipv6_file"
}

# Function to install iptables and iptables-persistent if not present
install_iptables() {
  sudo apt-get remove -y iptables
  
  if ! command -v ip6tables &> /dev/null; then
    echo "Installing ip6tables..."
    sudo apt-get update
    sudo apt-get install -y --reinstall iptables
  fi

  if ! command -v iptables-save &> /dev/null; then
    echo "Installing iptables-persistent..."
    sudo apt-get install -y iptables-persistent
  fi

  # Ensure iptables service is enabled if the package is installed
  if [ -x /etc/init.d/iptables ]; then
    sudo update-rc.d iptables enable
  fi
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
  download_tor_nodes "https://www.dan.me.uk/torlist/?full" "/var/log/tor_full_list.txt"
  download_tor_nodes "https://www.dan.me.uk/torlist/?exit" "/var/log/tor_exit_list.txt"

  # Merge and deduplicate IP addresses
  merge_and_deduplicate "/var/log/tor_full_list.txt" "/var/log/tor_exit_list.txt"

  # Create iptables rule files if they don't exist
  create_iptables_files

  # Block IP addresses from the merged list
  block_ip_addresses "/var/log/merged_list.txt"

  # Reload iptables rules
  reload_iptables_rules

  ensure_ufw_enabled

  block_tor_ports
  
  # Clean up temporary files
  # cleanup

  echo "IP blocking measures have been applied."
}

# Run the main function
main
