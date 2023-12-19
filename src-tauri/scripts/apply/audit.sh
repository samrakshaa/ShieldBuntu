#!/bin/bash

if ! systemctl is-enabled auditd &> /dev/null; then
    sudo systemctl enable auditd
fi

if ! systemctl is-active --quiet auditd; then
    sudo systemctl start auditd
fi

sudo auditctl -w  /etc/passwd -p  rwxa
sudo auditctl  -w  /tempdir/