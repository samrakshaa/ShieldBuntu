#!/bin/bash

directories=("/tmp" "/var/tmp" "/var/log" "/var/log/audit" "/dev/shm")

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

for dir in "${directories[@]}"; do
  fstab_entry="tmpfs $dir tmpfs nodev,nosuid,noexec 0 0"
  if grep -qE "^tmpfs\s+$dir\s+tmpfs\s+nodev,nosuid,noexec" /etc/fstab; then
    echo "$dir already has the correct entry in /etc/fstab."
  else
    if grep -qE "^tmpfs\s+$dir\s+" /etc/fstab; then
      echo "Updating mount options for $dir in /etc/fstab"
      sed -i "s|^tmpfs\s+$dir\s+.*|$fstab_entry|" /etc/fstab
    else
      echo "Adding $dir to /etc/fstab"
      echo "$fstab_entry" >> /etc/fstab
    fi
    if mountpoint -q "$dir"; then
      if mount -o remount "$dir"; then
        echo "Successfully remounted $dir"
      else
        echo "Failed to remount $dir. Please check if $dir is a tmpfs filesystem."
      fi
    else
      if mount "$dir"; then
        echo "Successfully mounted $dir"
      else
        echo "Failed to mount $dir. Please check if $dir is available and a valid tmpfs mountpoint."
      fi
    fi
  fi
done

echo "Done"
