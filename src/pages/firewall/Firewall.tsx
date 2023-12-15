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
import { useFirewallStore } from "@/store";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import BackButton from "@/components/BackButton";

const Firewall = () => {
  const { toast } = useToast();
  const { changeFirewall: updateFirewallStatus, firewall: firewallStatus } =
    useFirewallStore();
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

  const { isLoading: isDisablelLoading, execute: executeDisable } = useLoading({
    functionToExecute: () => invoke("reverse_firewall_rules"),
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
    functionToExecute: () => invoke("check_firewall"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      if (resJSON.enabled) {
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

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    executeStatus();
  }, []);

  return (
    <div className="firewall flex flex-row justify-center mx-auto max-w-[900px] p-6 pt-0">
      <div className="main-section py-12">
        <div className=" flex gap-4  items-center">
          <BackButton
            className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
            onClick={handleBack}
          />
          <h1 className="text-3xl font-bold">Firewall Configuration</h1>
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
          Control network ports and firewall rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <br />
        <div className="toggle-firewall bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <p>Enable/Disable Firewall</p>
            {(isDisablelLoading || isEnablelLoading || isStatusLoading) && (
              <Loader />
            )}
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
          <Table className="">
            {/* <TableCaption>IP table rules.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg" colSpan={2}>
                  Custom IP table rules
                  <Button className="absolute right-0 top-0">
                    View Current Rules
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Add more rules</TableCell>
                <TableCell className="relative">
                  <Button className="absolute right-0 top-0">ADD</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Firewall;
