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

const Advance = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col max-w-[900px] mx-auto p-4">
      <div className=" flex gap-2 mt-12">
        <BackButton
          className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
          onClick={handleBack}
        />
        <h1 className="text-3xl pl-2 font-bold">Advanced Hardening</h1>
        <TooltipProvider>
          <Tooltip delayDuration={20}>
            <TooltipTrigger className="flex-1">
              {" "}
              <HiOutlineInformationCircle size={25} />
            </TooltipTrigger>
            <TooltipContent className="content-tooltip max-w-[440px]">
              Advanced Hardening
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* USB */}
      <Usb />
    </div>
  );
};

export default Advance;
