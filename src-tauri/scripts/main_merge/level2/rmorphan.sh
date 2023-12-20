#!/bin/bash

sudo apt autoremove -y
sudo apt clean

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

remove_specific_packages
disable_filesystems

