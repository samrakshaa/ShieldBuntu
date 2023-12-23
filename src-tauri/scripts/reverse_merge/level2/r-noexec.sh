#!/bin/bash

directories=("/tmp" "/var/tmp" "/var/log" "/var/log/audit" "/dev/shm")

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

for dir in "${directories[@]}"; do
  fstab_entry="tmpfs $dir tmpfs nodev,nosuid,noexec 0 0"
  
  # Remove entry from /etc/fstab
  grep -vFx "$fstab_entry" /etc/fstab > /etc/fstab.tmp
  mv /etc/fstab.tmp /etc/fstab
  
  # Unmount directory
  if mountpoint -q "$dir"; then
    if umount "$dir"; then
      echo "Successfully unmounted $dir"
    else
      echo "Failed to unmount $dir. Please check if $dir is a tmpfs filesystem."
    fi
  else
    echo "$dir is not currently mounted."
  fi
done

echo "Done"
