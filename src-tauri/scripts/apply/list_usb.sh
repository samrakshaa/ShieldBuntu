#! /bin/bash

USB_LIST=$(lsusb)
echo "$USB_LIST" | cat -n