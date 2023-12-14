#!/bin/bash

# Function to check if SSH is enabled
#!/bin/bash

# Check if SSH service is enabled
is_ssh_enabled() {
    if sudo systemctl status ssh | grep -w active &> /dev/null; then
        echo "{\"enabled\": true}"
        exit 0
    else
        echo "{\"enabled\": false}"
        exit 0
    fi
}

# Check if SSH service is enabled
is_ssh_enabled