#!/bin/bash

# Function to check internet connectivity
check_internet() {
    wget -q --spider http://example.com

    if [ $? -eq 0 ]; then
        return 0  # Internet is available
    else
        return 1  # Internet is not available
    fi
}

# Set the directory where package files are located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$SCRIPT_DIR/../package"

# Function to install a package
install_package() {
    local package_file="$1"
    sudo dpkg -i $package_file.deb
}

# Check internet connectivity
if check_internet; then
    # If internet is available, update apt cache and install auditd package
    sudo apt update
    sudo apt install auditd -y
else
    # If internet is not available, install auditd from local files
    install_package "$PACKAGE_DIR/auditd"
fi

# Enable and start auditd service if not already enabled/active
if ! systemctl is-enabled auditd &> /dev/null; then
    sudo systemctl enable auditd
fi

if ! systemctl is-active --quiet auditd; then
    sudo systemctl start auditd
fi

# Modify GRUB_CMDLINE_LINUX in /etc/default/grub
sudo sed -i 's/^GRUB_CMDLINE_LINUX=.*/GRUB_CMDLINE_LINUX="audit=1"/' /etc/default/grub

# Update GRUB
sudo update-grub

# Set up audit rules
sudo auditctl -w /etc/passwd -p rwxa
sudo auditctl -w /tempdir/

echo "Auditd installation and configuration completed."