import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { HiOutlineInformationCircle } from "react-icons/hi";
import BackButton from "@/components/BackButton";
import { Switch } from "@/components/ui/switch";
import { useUsbStore } from "@/store";
import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Usb = () => {
  const {
    usbStatus,
    connectedUsbs,
    whiteListedUsbs,
    blackListedUsbs,
    changeUsbStatus,
    setConnectedUsbs,
    setBlackUsbs,
    setWhiteUsbs,
  } = useUsbStore();
  const { toast } = useToast();

  // Enabling USB blocking
  const { isLoading: isEnablelLoading, execute: executeEnable } = useLoading({
    functionToExecute: () => invoke("apply_usb_rules"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log(resJSON);
      if (resJSON.success) {
        console.log("usb on");
        changeUsbStatus(true);
      } else {
        console.log("not able to enable usb");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable usb.",
        });
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  // Disabling USB blocking
  const { isLoading: isDisablelLoading, execute: executeDisable } = useLoading({
    functionToExecute: () => invoke("reverse_usb_rules"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log(resJSON);
      if (resJSON.success) {
        console.log("usb off");
        changeUsbStatus(false);
      } else {
        console.log("not able to disable usb");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable usb.",
        });
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  // Check status of USB blocking
  const { isLoading: isStatusLoading, execute: executeStatus } = useLoading({
    functionToExecute: () => invoke("check_usb"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      if (resJSON.enabled) {
        console.log("usb is enabled");
        changeUsbStatus(true);
      } else {
        console.log("usb is disabled");
        changeUsbStatus(false);
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "usb is ofline...",
      });
    },
  });

  // List connected usbs
  const { isLoading: isAllUsbsLoading, execute: executeGetAll } = useLoading({
    functionToExecute: () => invoke("list_usb_devices"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log(resJSON);
      setConnectedUsbs(resJSON);
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cannot fetch connected USBs...",
      });
    },
  });

  const handleSwitchChange = () => {
    if (!usbStatus) {
      console.log("trying to enable usb");
      executeEnable();
    } else {
      console.log("reverse_usb_rules");
      executeDisable();
    }
  };

  const [selectedBlockedRows, setSelectedBlockedRows] = useState<string[]>([]);
  const [selectedUnblockedRows, setSelectedUnblockedRows] = useState<string[]>(
    []
  );

  const handleBlockedCheckboxClick = (usbId: string) => {
    const isSelected = selectedBlockedRows.includes(usbId);
    let updatedSelectedRows: string[];

    if (isSelected) {
      updatedSelectedRows = selectedBlockedRows.filter((id) => id !== usbId);
    } else {
      updatedSelectedRows = [...selectedBlockedRows, usbId];
    }

    setSelectedBlockedRows(updatedSelectedRows);
  };

  const handleUnblockedCheckboxClick = (usbId: string) => {
    const isSelected = selectedUnblockedRows.includes(usbId);
    let updatedSelectedRows: string[];

    if (isSelected) {
      updatedSelectedRows = selectedUnblockedRows.filter((id) => id !== usbId);
    } else {
      updatedSelectedRows = [...selectedUnblockedRows, usbId];
    }

    setSelectedUnblockedRows(updatedSelectedRows);
  };

  const handleBlock = () => {
    // blocks selected USBS
  };
  const handleUnblock = () => {
    // unblocks selected USBS
  };

  useEffect(() => {
    executeGetAll();
  }, []);

  return (
    <div className="usb flex flex-row justify-center mx-auto max-w-[900px] p-6 pt-0">
      <div className="main-section py-12">
        <div className=" flex gap-2 items-center ">
          <BackButton />
          <h1 className="text-3xl font-bold">USB Configuration</h1>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger className="">
                {" "}
                <HiOutlineInformationCircle size={25} />
              </TooltipTrigger>
              <TooltipContent>Hover</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="py-2 text-foreground/50 leading-6">
          {/* feature-to-do: Add relevant text here... */}
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod quae
          perferendis quasi assumenda illum repellat neque possimus ipsa earum
          similique.
        </p>
        <br />
        <div className="toggle-usb bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <p>USB Blocking</p>
            {/* {(isDisablelLoading || isEnablelLoading || isStatusLoading) && (
              <Loader />
            )} */}
          </div>
          <Switch
            className=""
            // checked={usbStatus}
            // disabled={isDisablelLoading || isEnablelLoading || isStatusLoading}
            // onClick={handleSwitchChange}
          />
        </div>
        <br />

        {/* USB table */}
        <div className="usbtable mt-6">
          <h2 className="text-2xl mb-4 font-bold ">Connected USBs</h2>
          {usbStatus ? (
            <div>
              <div className="blacklistTable flex flex-col">
                <h2 className="text-lg underline">Blocked USB Devices</h2>
                <Table className="usbBlocking">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="font-bold text-lg py-2">
                        ID
                      </TableHead>
                      <TableHead className="font-bold text-lg">Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blackListedUsbs.map((usb, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2">
                          <Checkbox
                            onCheckedChange={() =>
                              handleBlockedCheckboxClick(usb.id)
                            }
                            checked={selectedBlockedRows.includes(usb.id)}
                            disabled={!usbStatus}
                          />
                        </TableCell>
                        <TableCell className="py-2">{usb.id}</TableCell>
                        <TableCell className="py-2">{usb.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  className="bg-[green] max-w-[150px] self-end"
                  disabled={selectedBlockedRows.length === 0}
                  onClick={handleUnblock}
                >
                  Unblock Selected
                </Button>
              </div>

              <div className="whitelistTable flex flex-col">
                <h2 className="text-lg underline">Unblocked USB Devices</h2>
                <Table className="usbBlocking">
                  <TableCaption>Whitelisted USBs</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead className="text-lg">ID</TableHead>
                      <TableHead className="text-lg">Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {whiteListedUsbs.map((usb, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2">
                          <Checkbox
                            onCheckedChange={() =>
                              handleUnblockedCheckboxClick(usb.id)
                            }
                            checked={selectedUnblockedRows.includes(usb.id)}
                            disabled={!usbStatus}
                          />
                        </TableCell>
                        <TableCell className="py-2">{usb.id}</TableCell>
                        <TableCell className="py-2">{usb.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  className="bg-[red] max-w-[150px] self-end"
                  disabled={selectedUnblockedRows.length === 0}
                  onClick={handleBlock}
                >
                  Block Selected
                </Button>
              </div>
            </div>
          ) : (
            <Table className="no-usbBlocking">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="text-lg">ID</TableHead>
                  <TableHead className="text-lg">Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectedUsbs.map((usb, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox disabled />
                    </TableCell>
                    <TableCell>{usb.id}</TableCell>
                    <TableCell>{usb.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usb;
