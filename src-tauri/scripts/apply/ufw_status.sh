#! /bin/bash

UFW=$(ufw status)
echo "$UFW" | cat -n