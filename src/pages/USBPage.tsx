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
    </div>
  );
};

export default USBPage;
