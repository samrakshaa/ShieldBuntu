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
    name: "ssh",
    function: "check_ssh",
  },

  {
    name: "grub_password",
    function: "grub_pass_check",
  },
  {
    name: "kernel_status",
    function: "check_kernel_status",
  },
  {
    name: "tor_status",
    function: "check_tor_blocked",
  },
];

function StatusOfAll({}: Props) {
  const [services, setServices] = useState({
    firewall: false,
    kernel_status: false,
    ssh: false,
    grub_password: false,
    tor_status: false,
  });
  const [allStatusLoading, setAllStatusLoading] = useState(false);

  const getAllServices = async () => {
    setAllStatusLoading(true);
    let hasErrorOccurred = false;

    let serviceStatusUpdates: { [key: string]: boolean } = {};

    const servicePromises = allServicesConfig.map((service) =>
      invoke(service.function)
        .then((res: any) => {
          const resJSON = JSON.parse(res);
          serviceStatusUpdates[service.name.trim()] =
            resJSON.enabled || resJSON.success;
        })
        .catch((error) => {
          console.error(`Error checking ${service.name}:`, error);
          serviceStatusUpdates[service.name.trim()] = false;
          hasErrorOccurred = true;
        })
    );

    await Promise.all(servicePromises).finally(() => {
      setServices((prev) => ({ ...prev, ...serviceStatusUpdates }));
      if (hasErrorOccurred) {
        // Handle the error scenario here, e.g., show an error message to the user
      }
      setAllStatusLoading(false);
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
  console.log(services);
  return (
    <div className="grid grid-flow-row grid-cols-3  gap-2  ">
      {allStatusLoading
        ? [0, 0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-20 rounded-xl bg-secondary "
            />
          ))
        : Object.entries(services).map(([key, value], index: number) => {
            return (
              <div
                key={index}
                className={`h-20 w-full border-2  rounded-xl p-4 flex items-center  justify-between ${
                  value
                    ? "border-emerald-500 bg-emerald-700/10 "
                    : "bg-secondary"
                } `}
              >
                <div className="capitalize font-bold">
                  {key.replace("_", " ")}
                </div>
                <div
                  className={`flex gap-2 justify-center items-center text-xs ${
                    value && "text-emerald-300"
                  } `}
                >
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
