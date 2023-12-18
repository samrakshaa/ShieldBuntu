import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { TimeoutProps } from "react-transition-group/Transition";

const Tor = () => {
  const [logs, setLogs] = useState("");
  const [timer, setTimer] = useState(0);
  const { toast } = useToast();
  const {
    runTorDisable,
    tor: torStatus,
    torTimeout,
    torTimeoutTimestamp,
    setTorTimeout,
  } = useNetworkStore();
  const { isLoading: isEnablelLoading, execute: executeEnable } = useLoading({
    functionToExecute: () => invoke("block_tor_access"),
    onSuccess: (res: any) => {
      const resJson = JSON.parse(res);
      if (resJson.success) {
        console.log("Tor on");
        runTorDisable(true);
        setTorTimeout(true);
      } else {
        const currLog = res as string;

        console.log(currLog);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Not able to enable/disable Tor.",
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
    if (!torTimeout) {
      executeEnable();
    } else {
      toast({
        variant: "destructive",
        title: "Timeout active",
        description:
          "Please wait for the timeout to finish before running again.",
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (torTimeout) {
      const remainingTime = 10 * 60 * 1000 - (Date.now() - torTimeoutTimestamp);
      setTimer(remainingTime);

      countdownInterval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(countdownInterval);
            setTorTimeout(false);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [torTimeout, torTimeoutTimestamp, setTorTimeout]);

  return (
    <div className="Tor flex flex-row justify-center p-8">
      <div className="main-section">
        <div className=" flex gap-2 items-center">
          <h1 className="text-2xl text-primary font-bold">
            Tor Configuration{" "}
          </h1>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger className="">
                {" "}
                <HiOutlineInformationCircle size={25} />
              </TooltipTrigger>
              <TooltipContent className="content-tooltip max-w-[440px]">Tor safeguards anonymity, routing internet traffic through a distributed network, shielding identities and activities for enhanced privacy and security.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="py-2 text-foreground/50 leading-6">
          Control network ports and Tor rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <div className="enableTor flex flex-row items-center gap-4 mt-2">
          <div className="toggle-Tor bg-secondary/60 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center w-5/6">
            <div className="flex flex-row items-center">
              <p>Enable/Disable Tor</p>
              {isEnablelLoading && <Loader />}
            </div>
            <Button
              className=""
              disabled={isEnablelLoading || torTimeout}
              onClick={handleSwitchChange}
            >
              {torStatus ? (
                <>{torTimeout ? "Tor Blocked" : "Run Update"}</>
              ) : (
                "Run Block"
              )}
            </Button>
          </div>
          {torTimeout ? (
            <div className="timer w-1/6">
              {torTimeout && <p>Remaining time: {formatTime(timer)}</p>}
            </div>
          ) : (
            "Timer holder"
          )}
        </div>
      </div>
    </div>
  );
};

export default Tor;
