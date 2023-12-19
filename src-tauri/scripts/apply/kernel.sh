#!/bin/bash

backup_file="/etc/sysctl.conf.bak"

if [ ! -e "$backup_file" ]; then
    cp /etc/sysctl.conf "$backup_file"
fi

add_sysctl() {
    sysctl_param=$1
    sysctl_value=$2

    grep -qE "^$sysctl_param\s*=" /etc/sysctl.conf

    if [ $? -eq 0 ]; then
        sed -i "s/^$sysctl_param\s*=.*/$sysctl_param = $sysctl_value/" /etc/sysctl.conf
    else
        echo "$sysctl_param = $sysctl_value" >> /etc/sysctl.conf
    fi
}

add_sysctl "net.ipv4.tcp_syncookies" 1
add_sysctl "net.ipv4.tcp_max_syn_backlog" 2048
add_sysctl "net.ipv4.tcp_synack_retries" 2
add_sysctl "net.ipv4.tcp_syn_retries" 5
add_sysctl "net.ipv4.tcp_fin_timeout" 15
add_sysctl "net.ipv4.tcp_keepalive_time" 300
add_sysctl "net.ipv4.tcp_keepalive_probes" 5
add_sysctl "net.ipv4.tcp_keepalive_intvl" 15

add_sysctl "net.ipv4.conf.all.accept_source_route" 0
add_sysctl "net.ipv4.conf.default.accept_source_route" 0

add_sysctl "net.ipv4.conf.all.accept_redirects" 0
add_sysctl "net.ipv4.conf.default.accept_redirects" 0

add_sysctl "net.ipv4.conf.all.secure_redirects" 0
add_sysctl "net.ipv4.conf.default.secure_redirects" 0

add_sysctl "net.ipv6.conf.all.disable_ipv6" 1
add_sysctl "net.ipv6.conf.default.disable_ipv6" 1
add_sysctl "net.ipv6.conf.lo.disable_ipv6" 1

add_sysctl "net.ipv4.icmp_echo_ignore_broadcasts" 1

add_sysctl "net.ipv4.icmp_ignore_bogus_error_responses" 1

add_sysctl "net.ipv4.conf.all.log_martians" 1
add_sysctl "net.ipv4.conf.default.log_martians" 1

add_sysctl "net.ipv4.tcp_syncookies" 1

add_sysctl "net.ipv4.ip_forward" 0
add_sysctl "net.ipv4.conf.all.send_redirects" 0
add_sysctl "net.ipv4.conf.default.send_redirects" 0
add_sysctl "net.ipv6.conf.all.forwarding" 0
add_sysctl "net.ipv6.conf.default.forwarding" 0

add_sysctl "net.ipv4.conf.all.rp_filter" 1
add_sysctl "net.ipv4.conf.default.rp_filter" 1

add_sysctl "net.ipv6.conf.all.use_tempaddr" 2
add_sysctl "net.ipv6.conf.default.use_tempaddr" 2

add_sysctl "net.ipv6.conf.all.accept_ra" 0
add_sysctl "net.ipv6.conf.default.accept_ra" 0

add_sysctl "kernel.exec-shield" 1
add_sysctl "kernel.randomize_va_space" 2

sysctl -p

echo "Kernel hardening configuration applied successfully!"