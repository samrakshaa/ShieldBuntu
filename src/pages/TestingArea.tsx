import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";

const USBPage = () => {
  const handleClick = () => {
    invoke("kernel")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick2 = () => {
    invoke("reverse_kernel")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick3 = () => {
    invoke("custom_script", {"scriptIds": ["5", "7"]})
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick4 = () => {
    invoke("apply_firewall_rules", {"port": "3000", "action": "d"})
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick5 = () => {
    invoke("grub_pass_check")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick6 = () => {
    invoke("grub_pass_add", {"pass": "hello"})
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick7 = () => {
    invoke("list_ports")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick8 = () => {
    invoke("reverse_ssh_rules")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick9 = () => {
    invoke("check_ssh")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick10 = () => {
    invoke("block_tor_access")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick11 = () => {
    invoke("reverse_tor_block")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick12 = () => {
    invoke("check_tor_blocked")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick13 = () => {
    invoke("check_sudo_user")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick14 = () => {
    invoke("no_exec")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick15 = () => {
    invoke("check_selinux")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick16 = () => {
    invoke("list_usb_devices_usbguard")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick17 = () => {
    invoke("apply_usb_blocking", {
          usbIds: ["0bda:c123", "17ef:6099", "413c:301a", "04f2:b725"],
        })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick18 = () => {
    invoke("reverse_usb_blocking", {
          usbIds: ["093a:2510", "17ef:6099", "413c:301a", "04f2:b725"],
        })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  // const handleClick18 = () => {
  //   invoke("whitelist_usb", {
  //     usbIds: ["0bda:c123", "17ef:6099", "413c:301a", "04f2:b725"],
  //   })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.error(err));
  // };
  // const handleClick19 = () => {
  //   invoke("blacklist_usb", {
  //     usbIds: ["0bda:c123", "17ef:6099", "413c:301a", "04f2:b725"],
  //   })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.error(err));
  // };

  return (
    <div className="">
      <Button onClick={handleClick} className=" mt-32">
        Kernel
      </Button>
      <Button onClick={handleClick2} className=" mt-32">
        Reverse Kernel
      </Button>
      <Button onClick={handleClick3} className=" mt-32">
        Custom Script
      </Button>
      <Button onClick={handleClick4} className=" mt-32">
        Firewall
      </Button>
      <Button onClick={handleClick5} className=" mt-32">
        GRUB PASS CHECK
      </Button>
      <Button onClick={handleClick6} className=" mt-32">
        GRUB PASS ADD HELLO
      </Button>
      <Button onClick={handleClick7} className=" mt-32">
        LIST PORTS
      </Button>
      <Button onClick={handleClick8} className=" mt-32">
        Rev SSH
      </Button>
      <Button onClick={handleClick9} className=" mt-32">
        Check SSH
      </Button>
      <Button onClick={handleClick10} className=" mt-32">
        Tor
      </Button>
      <Button onClick={handleClick11} className=" mt-32">
        Rev TOR
      </Button>
      <Button onClick={handleClick12} className=" mt-32">
        Check TOR
      </Button>
      <Button onClick={handleClick13} className=" mt-32">
        SUDO USER
      </Button>
      <Button onClick={handleClick14} className=" mt-32">
        NO EXEC
      </Button>
      <Button onClick={handleClick15} className=" mt-32">
        Check selinux
      </Button>
      <Button onClick={handleClick16} className=" mt-32">
        Connected USB
      </Button>
      <Button onClick={handleClick17} className=" mt-32">
        Enable USB Blocking
      </Button>
      <Button onClick={handleClick18} className=" mt-32">
        Disable USB Blocking
      </Button>

      {/* <Button onClick={handleClick18} className=" mt-32">
        Whitelist Usb Devices
      </Button>
      <Button onClick={handleClick19} className=" mt-32">
        Blacklist Usb Devices
      </Button> */}
    </div>
  );
};

export default USBPage;
