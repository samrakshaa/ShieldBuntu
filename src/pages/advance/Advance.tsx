import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BackButton from "@/components/BackButton";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi";
import Usb from "../usb/Usb";
import Firewall from "../firewall/Firewall";
import GrubPass from "@/components/GrubPass";
import { GiRank2 } from "react-icons/gi";

const Advance = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col max-w-[1000px] mx-auto py-4">
      <div className=" flex gap-2 mt-12">
        <BackButton
          className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
          onClick={handleBack}
        />
        <h1 className="text-5xl pl-2 font-bold flex "><GiRank2  />  Level-2 Hardening</h1>
        <br />
        <TooltipProvider>
          <Tooltip delayDuration={20}>
            <TooltipTrigger className="">
              {" "}
              <HiOutlineInformationCircle size={25} />
            </TooltipTrigger>
            <TooltipContent className="content-tooltip max-w-[440px]">
              Advanced security measures exceeding CIS benchmarks, involving
              user interaction for fortified system setup.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <hr className="mt-10 border-[1px] "/>

      <GrubPass />
      <Firewall />

      {/* USB */}
      <Usb />
    </div>
  );
};

export default Advance;
