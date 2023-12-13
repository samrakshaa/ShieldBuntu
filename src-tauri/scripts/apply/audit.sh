#!/bin/bash

sudo apt install auditd -y
sudo systemctl enable auditd
sudo systemctl start auditd