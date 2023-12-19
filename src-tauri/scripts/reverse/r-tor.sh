#!/bin/bash

is_ipv6() {
  [[ "$1" == *:* ]]
}

unblock_tor_ports() {
  ufw delete deny 9001    
  ufw delete deny 9030     
  ufw delete deny 9050     
  ufw delete deny 9051     
  ufw delete deny 9000
  ufw delete deny 9150
  ufw delete deny 9040
}
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
  done < "$file"
}

reload_iptables_rules() {
  if command -v systemctl &> /dev/null && systemctl list-unit-files | grep -q iptables; then
    sudo systemctl restart iptables
  else
    sudo iptables-restore < /etc/iptables/rules.v4
    sudo ip6tables-restore < /etc/iptables/rules.v6
  fi
}

cleanup() {
  sudo rm -f "/var/log/tor_full_list.txt" "/var/log/tor_exit_list.txt" "/var/log/merged_list.txt"
}

unblock_main() {
  if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)." >&2
    exit 1
  fi
  unblock_tor_ports
  unblock_ip_addresses "/var/log/merged_list.txt"
  reload_iptables_rules
  cleanup

  echo "IP unblocking measures have been applied."
}

unblock_main
