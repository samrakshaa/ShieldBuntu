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
import { GiRank1 } from "react-icons/gi";

const Basic = () => {
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
      <div className="flex flex-col max-w-[1000px] mx-auto py-4">
        <div className=" flex gap-2 mt-12">
          <BackButton
            className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
            onClick={handleBack}
          />
          <h1 className="text-5xl pl-2 font-bold flex "><GiRank1 />Level-1 Hardening</h1>
          <br />
          
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger className="flex-1">
                {" "}
                <HiOutlineInformationCircle size={25} />
              </TooltipTrigger>
              <TooltipContent className="content-tooltip max-w-[440px]">
              Automated hardening features aligned with CIS benchmarks, requiring minimal user interaction.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <hr className="mt-10 border-[1px]  "/>

      {/* undate and remove */}
      <div className="flex flex-col mt-12  max-w-[1000px] mx-auto ">
        <h1 className=" text-lg font-bold align-left ">
          System Update & Cleaning
        </h1>
        <div className="basic-settings-content flex flex-row items-center p-2 my-4 bg-secondary/60 border-[1px] border-secondary rounded-lg justify-between">
          <p className="font-normal max-w-2/3 m-3 justify-evenly">
            Check relevant updates for packages and installed applications;
            there might be some deprecated or unused packages, which need to be
            deleted - click on the right to instigate upgrades and delete
            packages.
          </p>
          <div className="flex flex-col lg:flex-row items-center lg:items-end lg:justify-between mt-4 lg:mt-0">
            <Button
              className="font-normal text-base max-w-xl bg-secondary border-2 border-white/90 rounded
              hover:bg-secondary/50 my-2 mx-3"
              onClick={updatePackages}
            >
              {packagesUpdateLoading ? "Updating..." : "Update Packages"}
            </Button>
            <Button
              className="max-w-xl bg-primary borderW-2 border-secondary/90 rounded hover:bg-primary/80 my-2 mx-3"
              disabled={removeUnusedLoading}
              onClick={removeUnsedPackages}
            >
              {removeUnusedLoading ? "Removing..." : "Remove Unused Packages"}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-12 px-4  mx-auto">
        <Tor />
        <Ssh />
      </div>
    </div>
  );
};

export default Basic;
