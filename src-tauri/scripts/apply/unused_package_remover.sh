#!/bin/bash

install_deborphan() {
  echo "Installing Deborphan..."
  sudo apt install deborphan -y
}
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
  PACKAGE_REMOVE="apport* autofs avahi* beep pastebinit popularity-contest rsh* rsync talk* telnet* tftp* whoopsie xinetd yp-tools ypbind"

  for deb_remove in $PACKAGE_REMOVE; do
    sudo apt purge "$deb_remove" -y
  done
}
if [ $# -eq 0 ]; then
  echo "Please provide your password as a parameter."
  exit 1
fi
install_deborphan
remove_unused_packages
remove_specific_packages