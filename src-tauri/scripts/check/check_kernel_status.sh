#!/bin/bash

echo "{"
first=true
while IFS= read -r line || [[ -n "$line" ]]; do
    line=$(echo "$line" | sed 's/#.*//') # Remove comments
    if [[ $line =~ ^[[:space:]]*([a-zA-Z0-9._]+)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        if [ "$first" = true ]; then
            first=false
        else
            echo ","
        fi
        echo -n "    \"$key\": \"$value\""
    fi
done < /etc/sysctl.conf
echo -e "\n}"
