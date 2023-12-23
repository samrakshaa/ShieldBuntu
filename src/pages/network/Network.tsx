import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi";
import BackButton from "@/components/BackButton";
import Ssh from "@/components/Ssh";
import Tor from "@/components/Tor";
import { useNavigate } from "react-router-dom";

const Network = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-12 mx-auto max-w-[900px] ">
      <div className=" flex gap-2 items-center ">
        <BackButton
          className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
          onClick={handleBack}
        />
        <h1 className="text-3xl pl-2 font-bold">Network Settings</h1>
        <TooltipProvider>
          <Tooltip delayDuration={20}>
            <TooltipTrigger className="">
              {" "}
              <HiOutlineInformationCircle size={25} />
            </TooltipTrigger>
            <TooltipContent className="content-tooltip max-w-[440px]">
              Network setting hardening secures the OS, fortifying defenses and
              preventing unauthorized access for robust data protection.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="py-2 text-foreground/50 leading-6">
        Customize SSH and TOR settings for secure, anonymous, and efficient
        networking. Manage access, encryption, and routing protocols for
        heightened control and enhanced security within a streamlined
        configuration interface.
      </p>
      <br />
      <Ssh />
      <Tor />
    </div>
  );
};

export default Network;
