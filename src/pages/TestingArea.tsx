import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";

const USBPage = () => {
  const handleClick = () => {
    invoke("list_usb_devices")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick2 = () => {
    invoke("remove_unused_packages")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick3 = () => {
    invoke("update_and_upgrade_packages")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick4 = () => {
    invoke("apply_firewall_rules")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick5 = () => {
    invoke("reverse_firewall_rules")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick6 = () => {
    invoke("check_firewall")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick7 = () => {
    invoke("apply_ssh_rules")
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
    invoke("selinux")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick14 = () => {
    invoke("reverse_selinux")
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
    invoke("apply_usb_blocking")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick18 = () => {
    invoke("whitelist_usb", {
      usbIds: ["0bda:c123", "17ef:6099", "413c:301a", "04f2:b725"],
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };
  const handleClick19 = () => {
    invoke("blacklist_usb", {
      usbIds: ["0bda:c123", "17ef:6099", "413c:301a", "04f2:b725"],
    })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <div className="">
      <Button onClick={handleClick} className=" mt-32">
        List USB
      </Button>
      <Button onClick={handleClick2} className=" mt-32">
        Ununsed Package Remover
      </Button>
      <Button onClick={handleClick3} className=" mt-32">
        Package Updater
      </Button>
      <Button onClick={handleClick4} className=" mt-32">
        Firewall
      </Button>
      <Button onClick={handleClick5} className=" mt-32">
        Rev Firewall
      </Button>
      <Button onClick={handleClick6} className=" mt-32">
        Check Firewall
      </Button>
      <Button onClick={handleClick7} className=" mt-32">
        SSH
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
        selinux
      </Button>
      <Button onClick={handleClick14} className=" mt-32">
        Rev selinux
      </Button>
      <Button onClick={handleClick15} className=" mt-32">
        Check selinux
      </Button>
      <Button onClick={handleClick17} className=" mt-32">
        Enable USB Blocking
      </Button>
      <Button onClick={handleClick16} className=" mt-32">
        Connected USB
      </Button>
      <Button onClick={handleClick18} className=" mt-32">
        Whitelist Usb Devices
      </Button>
      <Button onClick={handleClick19} className=" mt-32">
        Blacklist Usb Devices
      </Button>
    </div>
  );
};

export default USBPage;
