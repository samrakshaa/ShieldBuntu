import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { invoke } from "@tauri-apps/api/tauri";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { GiSheikahEye } from "react-icons/gi";
import useLoading from "@/hooks/useLoading";
import { useGStore } from "@/store";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";
import RefreshButton from "@/components/refreshButton";
import { Checkbox } from "@/components/ui/checkbox";

interface Port {
  port: string;
  action: "a" | "d";
}

const Firewall = () => {
  const { toast } = useToast();
  const {
    changeFirewall: updateFirewallStatus,
    firewall: firewallStatus,
    ports,
    setPorts,
    isRemote,
  } = useGStore();

  const [ruleData, setRuleData] = useState<Port>({ port: "", action: "a" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRuleData((prevData) => ({
      ...prevData,
      port: event.target.value,
    }));
  };

  const [isEnablelSpecificLoading, setIsEnableSpecificLoading] =
    useState(false);

  const handleActionChange = (selectedAction: "a" | "d") => {
    setRuleData((prevData) => ({
      ...prevData,
      action: selectedAction,
    }));
  };

  const navigate = useNavigate();
  const { isLoading: isEnablelLoading, execute: executeEnable } = useLoading({
    functionToExecute: () => invoke("apply_firewall_rules"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log(resJSON);
      if (resJSON.success) {
        console.log("firewall on");
        updateFirewallStatus(true);
      } else {
        console.log("not able to enable firewall");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable firewall.",
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

  const executeEnableSpecific = () => {
    setIsEnableSpecificLoading(true);
    invoke("apply_firewall_rules", {
      port: ruleData.port,
      action: ruleData.action,
    })
      .then((res) => {
        executeGetAll();
        setIsEnableSpecificLoading(false);
        console.log("success", res);
      })
      .catch((err: any) => {
        setIsEnableSpecificLoading(false);
        console.log("error", err);
      });
  };

  const { isLoading: isAllPortsLoading, execute: executeGetAll } = useLoading({
    functionToExecute: () => invoke("list_ports"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      const parsedData: any = {};

      // Split the string by lines
      const lines = resJSON.ufw_status.split("\n");

      // Extract the status
      parsedData.status = lines[0].split("\t")[1];

      // Extract the ports
      parsedData.ports = [];
      for (let i = 4; i < lines.length - 3; i++) {
        const [id, port, action, from] = lines[i].split(/\s+/).filter(Boolean);
        parsedData.ports.push({ port, action, from });
      }
      // console.log(res);
      console.log(parsedData.ports);
      setPorts(parsedData.ports);
      // setPorts(resJSON);
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

  const { isLoading: isDisablelLoading, execute: executeDisable } = useLoading({
    functionToExecute: () => invoke("reverse_firewall_rules", { isRemote }),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log(resJSON);
      if (resJSON.success) {
        console.log("firewall off");
        updateFirewallStatus(false);
      } else {
        console.log("not able to disable firewall");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable firewall.",
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

  const { isLoading: isStatusLoading, execute: executeStatus } = useLoading({
    functionToExecute: () => invoke("check_firewall", { isRemote }),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log(resJSON);
      if (resJSON.success) {
        // console.log(resJSON);
        console.log("firewall is enabled");
        updateFirewallStatus(true);
      } else {
        console.log("firewall is disabled");
        updateFirewallStatus(false);
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Firewall is ofline...",
      });
    },
  });

  const handleSwitchChange = () => {
    if (!firewallStatus) {
      console.log("trying to enable firewall");
      executeEnable();
    } else {
      console.log("reverse_firewall_rules");
      executeDisable();
    }
  };

  const handleAddPort = () => {
    setIsDialogOpen(false);
    executeEnableSpecific();
    console.log(ruleData);
  };

  const handleEdit = (port: any) => {
    setIsDialogOpen(true);
    setRuleData(() => ({ port: port.port, action: port.action }));
  };

  useEffect(() => {
    executeStatus();
  }, []);

  useEffect(() => {
    console.log("-------------");
    executeGetAll();
    console.log(ports);
    console.log("-------------");
  }, [firewallStatus]);

  return (
    <div className="firewall flex flex-row justify-center mx-auto ">
      <div className="main-section pt-8">
        <div className=" flex items-center justify-between ">
          <div className=" flex gap-2  ">
            {/* <BackButton
              className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
              onClick={handleBack}
            /> */}
            <h1 className="text-2xl text-primary font-bold">
              Firewall Configuration
            </h1>
            <TooltipProvider>
              <Tooltip delayDuration={20}>
                <TooltipTrigger className="flex-1">
                  {" "}
                  <HiOutlineInformationCircle size={25} />
                </TooltipTrigger>
                <TooltipContent className="content-tooltip max-w-[440px]">
                  Firewall is software that monitors incoming and outgoing
                  traffic based on pre-defined network rules. This section
                  provides concise list of all enabled firewall rules - the
                  section also involves options to block/manage open port
                  configurations.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RefreshButton
            loading={isStatusLoading}
            onClick={() => executeStatus()}
          />
        </div>
        <p className="py-2 text-foreground/50 leading-6">
          Control network ports and firewall rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <br />
        <div className="toggle-firewall bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <p>Enable/Disable Firewall</p>
            {(isDisablelLoading ||
              isEnablelLoading ||
              isStatusLoading ||
              isEnablelSpecificLoading ||
              isAllPortsLoading) && <Loader />}
          </div>
          <Switch
            className=""
            checked={firewallStatus}
            disabled={isDisablelLoading || isEnablelLoading || isStatusLoading}
            onClick={handleSwitchChange}
          />
        </div>
        <br />

        {/* IP table config */}
        <div className="iptable mt-12">
          <h2 className="text-xl mb-4 font-bold ">IP Table Configuration</h2>
          {(isDisablelLoading ||
            isEnablelLoading ||
            isStatusLoading ||
            isEnablelSpecificLoading ||
            isAllPortsLoading) && <Loader />}
          <Table className="">
            <TableHeader>
              <TableRow>
                Custom IP table rules
                <Dialog open={isDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="btn bg-primary text-white"
                    >
                      Add Rules
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Rules</DialogTitle>
                      <DialogDescription>
                        Add port number/ IP address to deny or allow access.
                        Click Add Rule when you are done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="port" className="text-right">
                          Port/IP Address
                        </Label>
                        <Input
                          id="port"
                          type="text"
                          value={ruleData.port}
                          onChange={handlePortChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="actionSelect" className="text-lg mb-2">
                          Select Action:
                        </label>
                        <select
                          id="actionSelect"
                          value={ruleData.action}
                          onChange={(e) => {
                            handleActionChange(e.target.value as "a" | "d");
                          }}
                          className="p-2 border border-gray-300 rounded-md bg-black text-white"
                        >
                          <option value="a">Allow</option>
                          <option value="d">Deny</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsDialogOpen(false)}>
                        Close
                      </Button>
                      <Button type="submit" onClick={handleAddPort}>
                        Add Rule clg
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <TableHead className="text-lg flex flex-row justify-between"></TableHead>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 text-lg font-bold">To</TableCell>
                <TableCell className="py-2 text-lg font-bold">From</TableCell>

                <TableCell className="py-2 text-lg font-bold">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ports.map((port, index) => {
                return (
                  <TableRow key={index} className="py-0">
                    <TableCell>{port.port}</TableCell>
                    <TableCell>{port.action}</TableCell>
                    <TableCell>{port.from}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEdit(port)}
                        className="bg-secondary"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Firewall;
