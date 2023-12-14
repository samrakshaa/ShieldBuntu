#!/bin/bash

# Function to check if an IP address is blocked
is_ip_blocked() {
  local ip="$1"

  # Check if there is a rule matching the source IP address with the "DROP" action
  if sudo iptables -C INPUT -s "$ip" -j DROP &>/dev/null; then
    return 0  # True, IP is blocked
  elif sudo ip6tables -C INPUT -s "$ip" -j DROP &>/dev/null; then
    return 0  # True, IPv6 is blocked
  else
    return 1  # False, IP is not blocked
  fi
}

# Function to check if a Tor port is blocked
is_tor_port_blocked() {
  local port="$1"
  
  # Check if the port is denied using ufw
  sudo ufw status numbered | grep -q "$port.*DENY"
  return $?
}

# Function to download Tor node list from URL
download_tor_nodes() {
  local url="$1"
  local output_file="$2"
  curl -sSL "$url" >> "$output_file"
}

# Function to extract IP addresses from a file
extract_ip_addresses() {
  local file="$1"
  # Capture both IPv4 and IPv6 addresses
  grep -E -o "([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})" "$file"
}

# Function to merge and deduplicate IP addresses from two files
merge_and_deduplicate() {
  local file1="$1"
  local file2="$2"
  sort -u "$file1" "$file2" > merged_list.txt
}

# Function to clean up temporary files
cleanup() {
  rm -f "merged_list.txt" "tor_full_list.txt" "tor_exit_list.txt"
}

# File to store Tor full node list
tor_full_list_file="tor_full_list.txt"

# File to store Tor exit node list
tor_exit_list_file="tor_exit_list.txt"

# Download Tor node lists
download_tor_nodes "https://www.dan.me.uk/torlist/?full" "$tor_full_list_file"
download_tor_nodes "https://www.dan.me.uk/torlist/?exit" "$tor_exit_list_file"

# Merge and deduplicate IP addresses
merge_and_deduplicate "$tor_full_list_file" "$tor_exit_list_file"

# File containing merged and deduplicated IP addresses
merged_file="merged_list.txt"

# Extract IP addresses from the merged file
ip_addresses=($(extract_ip_addresses "$merged_file"))

# Check if all IP addresses are blocked
all_blocked=true
for ip in "${ip_addresses[@]}"; do
  if ! is_ip_blocked "$ip"; then
    echo "{\"enabled\": false}"
    exit 0
  fi
done

# Check if Tor ports are blocked
tor_ports=(9001 9030 9050 9051 9000 9150 9040) 
for port in "${tor_ports[@]}"; do
  if ! is_tor_port_blocked "$port"; then
    echo "{\"enabled\": false}"
    exit 0
  fi
done

# Clean up temporary files
cleanup

echo "{\"enabled\": true}"