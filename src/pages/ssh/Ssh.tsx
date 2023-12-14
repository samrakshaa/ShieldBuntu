import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "../../components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { invoke } from "@tauri-apps/api/tauri";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLoading from "@/hooks/useLoading";
import { useNetworkStore } from "@/store";
import Loader from "@/components/Loader";

const Ssh = () => {
  const [logs, setLogs] = useState("");
  const { toast } = useToast();
  const updateSSHStatus = useNetworkStore((state) => state.toggleSSH);
  const SSHStatus = useNetworkStore((state) => state.ssh);
  const { isLoading: isEnablelLoading, execute: executeEnable } = useLoading({
    functionToExecute: () => invoke("apply_ssh_rules"),
    onSuccess: (res: any) => {
      const resJson = JSON.parse(res);
      if (resJson.success) {
        console.log("ssh on");
        updateSSHStatus();
      } else {
        const currLog = res as string;

        console.log(currLog);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable SSH.",
        });
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const { isLoading: isDisablelLoading, execute: executeDisable } = useLoading({
    functionToExecute: () => invoke("reverse_ssh_rules"),
    onSuccess: (res: any) => {
      const resJson = JSON.parse(res);
      if (resJson.success) {
        console.log("SSH off");
        updateSSHStatus();
      } else {
        console.log("not able to disable SSH");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable SSH.",
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

  const handleSwitchChange = () => {
    if (!SSHStatus) {
      console.log("trying to enable SSH");
      executeEnable();
    } else {
      console.log("trying to disable");
      executeDisable();
    }
  };

  return (
    <div className="SSH flex flex-row justify-center mx-auto max-w-[900px] p-8">
      <div className="main-section py-12">
        <div className=" flex gap-2  items-center ">
          <h1 className="text-3xl text-primary font-bold">
            SSH Configuration{" "}
          </h1>
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
          Control network ports and SSH rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <br />
        <div className="toggle-SSH bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <p>Enable/Disable SSH</p>
            {(isDisablelLoading || isEnablelLoading) && <Loader />}
          </div>
          <Switch
            className=""
            checked={SSHStatus}
            disabled={isDisablelLoading || isEnablelLoading}
            onClick={handleSwitchChange}
          />
        </div>
        <br />
      </div>
    </div>
  );
};

export default Ssh;
