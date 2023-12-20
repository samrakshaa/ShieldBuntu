#!/bin/bash

echo -e '============== Extracting Logs =============='
mkdir ~/logs
sudo cat /var/log/syslog > ~/logs/syslog.txt
sudo dmesg > ~/logs/kernellog.txt
sudo cat /var/log/auth.log > ~/logs/authlogs.txt
echo -e '============ Saved in Home/Logs folder ======='

