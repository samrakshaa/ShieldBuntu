import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";

type Props = {};

const allServicesConfig = [
  {
    name: "firewall", 
    function: "check_firewall",
  },
  {
    name: "ssh",
    function: "check_ssh",
  }
];



function StatusOfAll({}: Props) {


  const [services, setServices] = useState({
    firewall: false,
    // tor: false,
    // "usb": false,
    ssh: false,
  });
 

  const getAllServices = () => {
    allServicesConfig.forEach((service) => {
        invoke(service.function).then((res: any) => {
            const resJSON = JSON.parse(res);
            
            if (resJSON.enabled || resJSON.success) {
            setServices((prev) => ({ ...prev, [service.name]: true }));
            } else {
            
            setServices((prev) => ({ ...prev, [service.name]: false }));
            }
        });
    })
  }
  console.log("services", services)

  const {isLoading, execute:allServices } = useLoading({
    functionToExecute: () => getAllServices(),
    onSuccess: () => {
        console.log( "all services" , services);
    }
  }) 

  useEffect(() => {
    allServices();
  },[]) 
  return <div className="grig grid-cols-2 gap-6">
    <div className="h-20 w-36 border-4 rounded-xl bg-  ">dvdf</div>

  </div>;
}

export default StatusOfAll;
