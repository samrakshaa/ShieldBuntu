import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

type Props = {};

const allServicesConfig = [
  {
    name: "firewall",
    function: "check_firewall",
  },
  {
    name: "apparmor",
    function: "check_ssh",
  },
  {
    name: "App armour",
    function: "check_apparmor",
  },
  {
    name: "Usb Guard",
    function: "check_usb",
  },
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
    });
  };
  console.log("services", services);

  const { isLoading, execute: allServices } = useLoading({
    functionToExecute: () => getAllServices(),
    onSuccess: () => {
      console.log("all services", services);
    },
  });
  console.log(isLoading, "loading ....");

  useEffect(() => {
    allServices();
  }, []);
  return (
    <div className="grid grid-flow-row grid-cols-3  gap-2  ">
      {isLoading
        ? [0, 0, 0, 0,0,0,0,0,0].map((_, i) => (
            <Skeleton key={i} className="w-full h-20 rounded-xl bg-secondary " />
          ))
        : Object.entries(services).map(([key, value]) => {
            return (
              <div
                key={key}
                className={`h-20 w-full border-2  rounded-xl p-4 flex items-center  justify-between ${
                  value
                    ? "border-emerald-500 bg-emerald-700/10 "
                    : "bg-secondary"
                } `}
              >
                <div className="capitalize font-bold">{key}</div>
                <div className={`flex gap-2 justify-center items-center text-xs ${value && "text-emerald-300"} `}>
                  {value ? (
                    <>
                      Active
                      <span className="  inline-flex h-2 w-2 rounded-full bg-emerald-600 opacity-75  top-0 left-0 relative">
                        <span className="animate-ping  inline-flex h-4 w-4 -top-1/2 -left-1/2   rounded-full bg-emerald-600/20 opacity-75 absolute"></span>
                      </span>
                    </>
                  ) : (
                    "Inactive"
                  )}
                </div>
              </div>
            );
          })}
    </div>
  );
}

export default StatusOfAll;
