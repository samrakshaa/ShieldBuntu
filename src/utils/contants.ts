export const allServicesConfig = [
    {
      name: "single_user",
      key: 1,
      function: "check_sudo_user",
      description:
        "This service checks if the current user has sudo (superuser) privileges. Sudo privileges allow a user to execute commands with administrative permissions ",
    },
    {
      name: "firewall",
      key: 2,
      function: "check_firewall",
      description:
        "Manages system firewall settings, allowing control over incoming and outgoing network traffic by blocking or allowing specific ports and protocols.",
    },
    {
      name: "ssh",
      function: "check_ssh",
      key: 4,
      description:
        "Enhances SSH (Secure Shell) security protocols by configuring encryption methods, user authentication, and access control to safeguard remote access to the system.",
    },
    {
      name: "grub_password",
      key: 9,
      function: "grub_pass_check",
      description:
        "Secures the GRUB (Grand Unified Bootloader) bootloader by setting a password, preventing unauthorized access or modifications during system startup.",
    },
  
    {
      name: "tor_status",
      key: 5,
      function: "check_tor_blocked",
      description:
        "Blocks access to Tor network nodes and services, limiting or preventing the use of Tor for anonymous internet browsing.",
    },
    {
      name: "apparmor",
      key: 0,
      function: "check_apparmor",
      description: "AppArmor (Application Armor) is a Linux kernel security module that provides a framework for restricting the capabilities of programs. The ",
    },
  ];