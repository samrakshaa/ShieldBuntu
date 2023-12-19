#!/bin/bash

is_ip_blocked() {
  local ip="$1"
  if sudo iptables -C INPUT -s "$ip" -j DROP &>/dev/null; then
    return 0  
  elif sudo ip6tables -C INPUT -s "$ip" -j DROP &>/dev/null; then
    return 0  
  else
    return 1 
  fi
}
is_tor_port_blocked() {
  local port="$1"
  sudo ufw status numbered | grep -q "$port.*DENY"
  return $?
}
extract_ip_addresses() {
  local file="$1"
  grep -E -o "([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+|([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})" "$file"
}
merged_file="/var/log/merged_list.txt"
ip_addresses=($(extract_ip_addresses "$merged_file"))
all_blocked=true
for ip in "${ip_addresses[@]}"; do
  if ! is_ip_blocked "$ip"; then
    echo "{\"enabled\": false}"
    exit 0
  fi
done
tor_ports=(9001 9030 9050 9051 9000 9150 9040) 
for port in "${tor_ports[@]}"; do
  if ! is_tor_port_blocked "$port"; then
    echo "{\"enabled\": false}"
    exit 0
  fi
done

cleanup

echo "{\"enabled\": true}"