import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
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
  const { changeSSH: updateSSHStatus, ssh: SSHStatus } = useNetworkStore();
  const { isLoading: isEnablelLoading, execute: executeEnable } = useLoading({
    functionToExecute: () => invoke("apply_ssh_rules"),
    onSuccess: (res: any) => {
      const resJson = JSON.parse(res);
      if (resJson.success) {
        console.log("ssh on");
        updateSSHStatus(true);
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
        title: "Uh oh! Something went wrong while applying rules.",
        description: "There was a problem with your request.",
      });
    },
  });

  const { isLoading: isDisablelLoading, execute: executeDisable } = useLoading({
    functionToExecute: () => invoke("reverse_ssh_rules"),
    onSuccess: (res: any) => {
      const resJson = JSON.parse(res);
      if (resJson.success) {
        console.log("SSH off");
        updateSSHStatus(false);
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
        title: "Uh oh! Something went wrong while applying rules.",
        description: "There was a problem with your request.",
      });
    },
  });

  const { isLoading: isStatusLoading, execute: executeStatus } = useLoading({
    functionToExecute: () => invoke("check_ssh"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);

      if (resJSON.success) {
        console.log("SSH is enabled");
        updateSSHStatus(true);
      } else {
        console.log("SSH is disabled");
        updateSSHStatus(false);
      }
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong while checking SSH status.",
        description: "SSH is ofline...",
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

  useEffect(() => {
    executeStatus();
  }, []);

  return (
    <div className="SSH flex flex-row justify-center mx-auto max-w-[900px] p-8">
      <div className="main-section">
        <div className=" flex gap-2  items-center ">
          <h1 className="text-2xl text-primary font-bold">
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
            {(isDisablelLoading || isEnablelLoading || isStatusLoading) && (
              <Loader />
            )}
          </div>
          <Switch
            className=""
            checked={SSHStatus}
            disabled={isDisablelLoading || isEnablelLoading || isStatusLoading}
            onClick={handleSwitchChange}
          />
        </div>
        <br />
      </div>
    </div>
  );
};

export default Ssh;
