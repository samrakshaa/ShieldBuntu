import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";

const USBPage = () => {
  const handleClick = () => {
    invoke("list_usb_devices")
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <div className="">
      <Button onClick={handleClick} className=" mt-32">
        List USB
      </Button>
      <></>
    </div>
  );
};

export default USBPage;
