#!/bin/bash

is_ipv6() {
  [[ "$1" == *:* ]]
}

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

create_iptables_files() {
  local ipv4_file="/etc/iptables/rules.v4"
  local ipv6_file="/etc/iptables/rules.v6"

  local ipv4_dir=$(dirname "$ipv4_file")
  local ipv6_dir=$(dirname "$ipv6_file")

  mkdir -p "$ipv4_dir"
  mkdir -p "$ipv6_dir"

  touch "$ipv4_file"
  touch "$ipv6_file"

  echo "Created $ipv4_file"
  echo "Created $ipv6_file"
}

install_iptables() {
  apt remove -y iptables
  if ! command -v iptables &> /dev/null; then
    echo "Installing iptables..."
    apt-get update
    apt-get install -y --reinstall iptables
  fi

  if ! command -v iptables-save &> /dev/null; then
    echo "Installing iptables-persistent..."
    apt-get install -y iptables-persistent
  fi

  if [ -x /etc/init.d/iptables ]; then
    update-rc.d iptables enable
  fi
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

block_tor_ports() {
  local tor_ports=(9001 9030 9050 9051 9000 9150 9040)
  for port in "${tor_ports[@]}"; do
    ufw deny "$port"
  done
}


reload_iptables_rules() {
  if command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q iptables; then
    systemctl restart iptables
  else
    iptables-restore < /etc/iptables/rules.v4
    ip6tables-restore < /etc/iptables/rules.v6
  fi
}
main() {
  if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)." >&2
    exit 1
  fi
  install_iptables
  create_iptables_files
  block_ip_addresses "nodes.txt"
  reload_iptables_rules
  ensure_ufw_enabled
  block_tor_ports
  echo "IP blocking measures have been applied."
}

main

