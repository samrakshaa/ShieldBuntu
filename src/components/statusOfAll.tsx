import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { allServicesConfig } from "@/utils/contants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Button } from "./ui/button";
import { BiExport } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { set } from "react-hook-form";
import { toast } from "./ui/use-toast";

type Props = {};

function StatusOfAll({}: Props) {
  const [services, setServices] = useState({
    firewall: false,
    ssh: false,
    grub_password: false,
    tor_status: false,
    single_user: false,
  });
  const [allStatusLoading, setAllStatusLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlockedRows, setSelectedBlockedRows] = useState<string[]>(
    []
  );
  const getAllServices = async () => {
    setAllStatusLoading(true);
    let hasErrorOccurred = false;

    let serviceStatusUpdates: { [key: string]: boolean } = {};

    const servicePromises = allServicesConfig.map((service) =>
      invoke(service.function)
        .then((res: any) => {
          const resJSON = JSON.parse(res);
          serviceStatusUpdates[service.name.trim()] = resJSON.success;
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
console.log(selectedBlockedRows)
  useEffect(() => {
    allServices();
  }, []);
  const handleClick3 = () => {
    invoke("custom_script", {"scriptIds": selectedBlockedRows.filter(item => item !== undefined).map(String)})
      .then((res) => {
        toast({
          variant: "default",
          title: " Success!",
          description: " file createed successfully on /home/jayash/.samrakshak_logs",
          className: "border-emerald-500 bg-emerald-700/10 ",
        });
        setIsDialogOpen(false)
      })
      .catch((err) => console.error(err));
  };
  console.log(services);
  return (
    <>
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
                  className={`w-full border-2  rounded-xl p-4 flex flex-col items-center  justify-between ${
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
                    <div className="text-xs text-gray-500 mt-2 text-left">
                      {serviceInfo.description}
                    </div>
                  )}
                </div>
              );
            })}
      </div>
      <div className="firewall flex flex-row justify-center mx-auto w-full">
        <div className="w-full pt-8">
          <div className=" flex items-center justify-between ">
            <div className=" flex gap-2  ">
              {/* <BackButton
              className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
              onClick={handleBack}
            /> */}
              <h1 className="text-2xl text-primary font-bold">
                Configuration Export
              </h1>
              <TooltipProvider>
                <Tooltip delayDuration={20}>
                  <TooltipTrigger className="flex-1">
                    {" "}
                    <HiOutlineInformationCircle size={25} />
                  </TooltipTrigger>
                  <TooltipContent className="content-tooltip max-w-[440px]">
                    Export current hardened system settings for reference in
                    securing other systems.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="py-2 text-foreground/50 leading-6">
            The 'Export Current Configuration' function captures and saves the
            current fortified system setup into a file, offering a comprehensive
            reference guide for configuring and securing other systems based on
            established hardened settings.
          </p>
          <br />
          <Dialog open={isDialogOpen}>
            <DialogTrigger>
              <Button
                className="w-full p-6 rounded-xl text-2xl"
                onClick={() => setIsDialogOpen(true)}
              >
                Export Your Configuration&nbsp;&nbsp;
                <BiExport />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select config</DialogTitle>
                <DialogDescription>
                <Table className="usbBlocking">
                 
                  <TableBody className="flex flex-col h-[400px] overflow-auto w-full">
                    {allServicesConfig.map((item:any, index: number) => {
                      
                        return (
                          <TableRow
                            key={index}
                            onClick={() => {setSelectedBlockedRows([...selectedBlockedRows, item.key])}}
                            className=""
                          >
                            <TableCell className="py-2 " >
                              <Checkbox 
                                checked={selectedBlockedRows.includes(item.key)}
                                // disabled={!usbStatus}
                              />
                            </TableCell>
                            <div className="flex flex-row items-center">

                            <TableCell className="py-2">{item.name}</TableCell>
                            <TableCell className="py-2">{item.description}</TableCell>
                            </div>
                          </TableRow>
                        );
                    })}
                  </TableBody>
                </Table>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">sdnksnd</div>
              <DialogFooter>
                <Button
                  type="submit"
                  variant={"secondary"}
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={handleClick3}>
                  Create File
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <br />
        </div>
      </div>
    </>
  );
}

export default StatusOfAll;
