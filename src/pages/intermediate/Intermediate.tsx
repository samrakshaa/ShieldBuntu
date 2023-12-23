import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import Firewall from "../firewall/Firewall";
import Tor from "@/components/Tor";
import Ssh from "@/components/Ssh";

const Intermediate = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const { isLoading: removeUnusedLoading, execute: removeUnsedPackages } =
    useLoading({
      functionToExecute: () => invoke("remove_unused_packages"),
      onSuccess: (res: any) => {
        toast({
          variant: "default",
          title: " Success!",
          description: " Unused packages removed successfully",
          className: "border-emerald-500 bg-emerald-700/10 ",
        });
        console.log(res);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  const { isLoading: packagesUpdateLoading, execute: updatePackages } =
    useLoading({
      functionToExecute: () => invoke("update_and_upgrade_packages"),
      onSuccess: (res: any) => {
        toast({
          variant: "default",
          title: " Success!",
          description: " updated system & packages successfully",
          className: "border-emerald-500 bg-emerald-700/10 ",
        });
      },
      onError: (err) => {
        console.log(err, "error");
      },
    });

  return (
    <div>
      <div className=" flex flex-col max-w-[900px] mx-auto p-2">
        <div className=" flex gap-2 mt-12">
          <BackButton
            className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
            onClick={handleBack}
          />
          <h1 className="text-3xl pl-2 font-bold">Moderate Hardening</h1>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger className="flex-1">
                {" "}
                <HiOutlineInformationCircle size={25} />
              </TooltipTrigger>
              <TooltipContent className="content-tooltip max-w-[440px]">
                Moderate Hardening
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Firewall />
        <Tor />
        <Ssh />
      </div>
      {/* undate and remove */}
    </div>
  );
};

export default Intermediate;
