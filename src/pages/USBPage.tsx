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
      <Button onClick={handleClick3} className=" mt-32">
        Firewall
      </Button>
    </div>
  );
};

export default USBPage;
