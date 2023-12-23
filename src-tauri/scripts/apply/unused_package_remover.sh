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
    # If internet is available, download the latest deborphan package
    sudo apt update
    sudo apt install deborphan -y
else
    # If internet is not available, install deborphan from local files
    install_package "$PACKAGE_DIR/deborphan"
fi

remove_unused_packages() {
  echo "Finding unused packages with Deborphan..."
  unused_packages=$(deborphan)

  if [ -z "$unused_packages" ]; then
    echo "No unused packages found."
  else
    echo "Unused packages found:"
    echo "$unused_packages"

    echo "Removing unused packages..."
    sudo apt-get remove --purge $unused_packages -y
    echo "Unused packages removed."
  fi
}

remove_specific_packages() {
  echo "Removing or masking specific packages..."
  services=("avahi" "cups" "dhcp" "ldap" "nfs" "bind9" "vsftpd" "apache2" "dovecot" "samba" "squid" "snmpd" "nis" "rsync")

  for service in "${services[@]}"; do
    if dpkg -l | grep -q $service; then
      dependencies=$(apt-cache show $service | grep Depends)
      if [ -z "$dependencies" ]; then
        echo "Removing $service..."
        sudo apt-get purge -y $service
      else
        echo "Masking $service..."
        sudo systemctl mask $service
      fi
    else
      echo "$service is not installed."
    fi
  done

  echo "Removal/masking process completed."
}

disable_filesystems() {
  echo "Disabling specified filesystems..."
  FILESYSTEMS=("cramfs" "freevxfs" "jffs2" "hfs" "hfsplus" "squashfs" "udf")

  for FS in "${FILESYSTEMS[@]}"; do
    if ! grep -q "^install $FS /bin/true" /etc/modprobe.d/"$FS".conf; then
      echo "Disabling $FS..."
      echo "install $FS /bin/true" > /etc/modprobe.d/"$FS".conf
    else
      echo "$FS is already disabled."
    fi
  done

  echo "Filesystems disabled."
}

remove_unused_packages
remove_specific_packages
disable_filesystems