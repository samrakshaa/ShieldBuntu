#! /bin/bash

username="$1"
ip="$2"
port="$3"
sudo ssh -i ~/.ssh/id_rsa -p $port $username@$ip