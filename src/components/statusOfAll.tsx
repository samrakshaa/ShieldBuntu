import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

type Props = {};

const allServicesConfig = [
  {
    name: "firewall",
    function: "check_firewall",
    description:
      "Manages system firewall settings, allowing control over incoming and outgoing network traffic by blocking or allowing specific ports and protocols.",
  },
  {
    name: "ssh",
    function: "check_ssh",
    description:
      "Enhances SSH (Secure Shell) security protocols by configuring encryption methods, user authentication, and access control to safeguard remote access to the system.",
  },
  {
    name: "grub_password",
    function: "grub_pass_check",
    description:
      "Secures the GRUB (Grand Unified Bootloader) bootloader by setting a password, preventing unauthorized access or modifications during system startup.",
  },
  {
    name: "kernel_status",
    function: "check_kernel_status",
    description:
      "Adjusts and configures system kernel settings, including system limits, feature toggles, and performance optimizations for better system functionality.",
  },
  {
    name: "tor_status",
    function: "check_tor_blocked",
    description:
      "Blocks access to Tor network nodes and services, limiting or preventing the use of Tor for anonymous internet browsing.",
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
            const serviceInfo = allServicesConfig.find(
              (service) => service.name === key
            );

            return (
              <div
                key={index}
                className={`h-36 w-full border-2  rounded-xl p-4 flex flex-col items-center  justify-between ${
                  value
                    ? "border-emerald-500 bg-emerald-700/10 "
                    : "bg-secondary"
                } `}
              >
                <div className=" flex justify-between w-full">
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
                {serviceInfo && (
                  <div className="text-xs text-gray-500 mt-2">
                    {serviceInfo.description}
                  </div>
                )}
              </div>
            );
          })}
    </div>
  );
}

export default StatusOfAll;
