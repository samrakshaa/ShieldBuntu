#!/bin/bash

check_internet() {
    wget -q --spider http://example.com

    if [ $? -eq 0 ]; then
        return 0  
    else
        return 1  
    fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$SCRIPT_DIR/../package"

install_package() {
    local package_file="$1"
    sudo dpkg -i $package_file.deb
}

if check_internet; then
    sudo apt update
    sudo apt install auditd -y
else
    install_package "$PACKAGE_DIR/auditd"
fi
if ! systemctl is-enabled auditd &> /dev/null; then
    sudo systemctl enable auditd
fi

if ! systemctl is-active --quiet auditd; then
    sudo systemctl start auditd
fi

sudo sed -i 's/^GRUB_CMDLINE_LINUX=.*/GRUB_CMDLINE_LINUX="audit=1"/' /etc/default/grub
sudo update-grub
sudo auditctl -w /etc/passwd -p rwxa
sudo auditctl -w /tempdir/

echo "Auditd installation and configuration completed."