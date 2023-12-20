#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
LOG_DIR="/home/jayash/.samrakshak_logs"

merge_scripts() {
  local merged_script=""

  for option in "$@"; do
    case $option in

      0)
        merged_script+="\n\n( sleep 2 && echo -e '================= Auto Logout =============='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level1/autologout.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      1)
        merged_script+="\n\n( sleep 2 && echo -e '================= Check Sudo Users ========='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level1/checksudo.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      2)
        merged_script+="\n\n( sleep 2 && echo -e '================= User Access Control =============='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level1/uac.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      3)
        merged_script+="\n\n( sleep 2 && echo -e '================= Tor Port Block(L1) =============='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level1/tor.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      4)
        merged_script+="\n\n( sleep 2 && echo -e '================= Firewall Config =========='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/firewall.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      5)
        merged_script+="\n\n( sleep 2 && echo -e '================= SSH Hardening ==============='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/ssh.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      6)
        merged_script+="\n\n( sleep 2 && echo -e '================= SSH Hardening =='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/usbblock.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      7)
        merged_script+="\n\n( sleep 2 && echo -e '================= Grub Password ============'\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/grubpass.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      8)
        merged_script+="\n\n( sleep 2 && echo -e '================= Kernel Hardening ========='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/kernel.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      9)
        merged_script+="\n\n( sleep 2 && echo -e '================= /tmp /var file permission =='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/noexec.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      10)
        merged_script+="\n\n( sleep 2 && echo -e '================= Remove(mask) unused packages =='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level2/rmorphan.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      11)
        merged_script+="\n\n( sleep 2 && echo -e '================= Audits =============='\n"
        merged_script+="$(cat $SCRIPT_DIR/main_merge/level1/audit.sh)\n"
        merged_script+="sleep 2 )\n\n"
        ;;
      *)
        echo "Invalid option: $option"
        exit 1
        ;;
    esac
  done
  echo -e "$merged_script"
}

# # Function to generate reverse script
# generate_reverse_script() {
#   local reversed_script=""

#   for option in $(echo "$@" | tr ' ' '\n' | tac | tr '\n' ' '); do
#     case $option in
#       1)
#         reversed_script+="\n\n( sleep 2 && echo -e '================= Reversed Auto Logout =============='\n"
#         reversed_script+="$(cat $SCRIPT_DIR/reverse/level1/r-autologout.sh)\n"
#         reversed_script+="sleep 2 )\n\n"
#         ;;
#       7)
#         reversed_script+="\n\n( sleep 2 && echo -e '================= Reversed Grub Password ============'\n"
#         reversed_script+="$(cat $SCRIPT_DIR/reverse/level2/r-grubpass.sh)\n"
#         reversed_script+="sleep 2 )\n\n"
#         ;;
#       8)
#         reversed_script+="\n\n( sleep 2 && echo -e '================= Reversed Kernel Hardening ========='\n"
#         reversed_script+="$(cat $SCRIPT_DIR/reverse/level2/r-kernel.sh)\n"
#         reversed_script+="sleep 2 )\n\n"
#         ;;
#       9)
#         reversed_script+="\n\n( sleep 2 && echo -e '================= Reversed /tmp /var file permission =='\n"
#         reversed_script+="$(cat $SCRIPT_DIR/reverse/level2/r-noexec.sh)\n"
#         reversed_script+="sleep 2 )\n\n"
#         ;;
#       *)
#         echo "Invalid option for reverse script: $option"
#         exit 1
#         ;;
#     esac
#   done
#   echo -e "$reversed_script"
# }

if [ "$#" -eq 0 ]; then
  echo "No parameters provided. Merging all scripts."
  selected_scripts="0 1 2 3 4 6 7 8 9 10 11"
else
  selected_scripts="$@"
fi

# Specify the output files
output_file="$LOG_DIR/output.sh"
# reverse_output_file="reverse_output.sh"

# Redirect the merged script to the output file
echo -e "#!/bin/bash\n" > "$output_file"
merge_scripts $selected_scripts >> "$output_file"
chmod +x "$output_file"
echo "Merged script has been written to: $output_file"

# # Redirect the reverse merged script to the output file
# echo -e "#!/bin/bash\n" > "$reverse_output_file"
# generate_reverse_script $selected_scripts >> "$reverse_output_file"
# chmod +x "$reverse_output_file"
# echo "Reverse merged script has been written to: $reverse_output_file"