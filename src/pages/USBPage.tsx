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
      <Button onClick={handleClick} className="text-black mt-32">
        Click here
      </Button>
    </div>
  );
};

export default USBPage;
