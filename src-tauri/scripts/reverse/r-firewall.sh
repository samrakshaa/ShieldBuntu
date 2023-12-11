#!/bin/bash

echo "Disabling and resetting UFW..."
sudo ufw disable
sudo ufw reset
echo "UFW disabled and reset."

echo "Reversal script completed. Please review the changes and make any additional adjustments as needed."
