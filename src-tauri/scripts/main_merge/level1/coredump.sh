#!/bin/bash
set_core_dump_limits() {
  echo "* hard core 0" | sudo tee -a /etc/security/limits.conf
  echo "kernel.core_dump=0" | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
}

echo "Configuring system to restrict core dumps..."
set_core_dump_limits
echo "Core dump restrictions applied."

read -p "Do you want to reboot the system now? (y/n): " reboot_choice

if [[ $reboot_choice =~ ^[Yy]$ ]]; then
  echo "Rebooting the system..."
  sudo reboot
else
  echo "Please consider rebooting the system to apply changes."
fi