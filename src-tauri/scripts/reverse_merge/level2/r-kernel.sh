#!/bin/bash

backup_file="/etc/sysctl.conf.bak"

# Check if a backup file exists
if [ -e "$backup_file" ]; then
    # Restore the original sysctl.conf file
    cp "$backup_file" /etc/sysctl.conf
fi

# Function to remove sysctl parameter from sysctl.conf
remove_sysctl() {
    sysctl_param=$1

    # Remove the line with the specified sysctl parameter
    sed -i "/^$sysctl_param\s*=/d" /etc/sysctl.conf
}

# Remove all the added sysctl parameters
remove_sysctl "net.ipv4.tcp_syncookies"
remove_sysctl "net.ipv4.tcp_max_syn_backlog"
remove_sysctl "net.ipv4.tcp_synack_retries"
remove_sysctl "net.ipv4.tcp_syn_retries"
remove_sysctl "net.ipv4.tcp_fin_timeout"
remove_sysctl "net.ipv4.tcp_keepalive_time"
remove_sysctl "net.ipv4.tcp_keepalive_probes"
remove_sysctl "net.ipv4.tcp_keepalive_intvl"

remove_sysctl "net.ipv4.conf.all.accept_source_route"
remove_sysctl "net.ipv4.conf.default.accept_source_route"

remove_sysctl "net.ipv4.conf.all.accept_redirects"
remove_sysctl "net.ipv4.conf.default.accept_redirects"

remove_sysctl "net.ipv4.conf.all.secure_redirects"
remove_sysctl "net.ipv4.conf.default.secure_redirects"

remove_sysctl "net.ipv6.conf.all.disable_ipv6"
remove_sysctl "net.ipv6.conf.default.disable_ipv6"
remove_sysctl "net.ipv6.conf.lo.disable_ipv6"

remove_sysctl "net.ipv4.icmp_echo_ignore_broadcasts"

remove_sysctl "net.ipv4.icmp_ignore_bogus_error_responses"

remove_sysctl "net.ipv4.conf.all.log_martians"
remove_sysctl "net.ipv4.conf.default.log_martians"

remove_sysctl "net.ipv4.tcp_syncookies"

remove_sysctl "net.ipv4.ip_forward"
remove_sysctl "net.ipv4.conf.all.send_redirects"
remove_sysctl "net.ipv4.conf.default.send_redirects"
remove_sysctl "net.ipv6.conf.all.forwarding"
remove_sysctl "net.ipv6.conf.default.forwarding"

remove_sysctl "net.ipv4.conf.all.rp_filter"
remove_sysctl "net.ipv4.conf.default.rp_filter"

remove_sysctl "net.ipv6.conf.all.use_tempaddr"
remove_sysctl "net.ipv6.conf.default.use_tempaddr"

remove_sysctl "net.ipv6.conf.all.accept_ra"
remove_sysctl "net.ipv6.conf.default.accept_ra"

remove_sysctl "kernel.randomize_va_space"

# Apply the changes
sysctl -p

echo "Kernel hardening configuration reverted successfully!"
