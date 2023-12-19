#!/bin/bash

# Check for blocked USB devices
output=$(sudo usbguard list-devices -b)

# Check if the output is not empty
if [[ ! -z "$output" ]]; then
    # Output JSON if blocked devices are found
    echo "{\"enabled\": true}"
else
    # Output JSON if no blocked devices are found
    echo "{\"enabled\": false}"
fi
