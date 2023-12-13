#!/bin/bash

# Function to check if SSH is enabled
#!/bin/bash

# Check if SSH service is enabled
is_ssh_enabled() {
    if sudo systemctl status ssh | grep -w active &> /dev/null; then
        echo true
    else
        echo false
    fi
}

# Get the SSH state
ssh_state=$(is_ssh_enabled)

# Return the SSH state in JSON format
echo "{\"ssh_state\": \"$ssh_state\"}"