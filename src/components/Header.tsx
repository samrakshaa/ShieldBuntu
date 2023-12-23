import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLoading from "@/hooks/useLoading";
import Loader from "@/components/Loader";
import { HiOutlineInformationCircle } from "react-icons/hi";
import BackButton from "@/components/BackButton";
import RefreshButton from "@/components/refreshButton";
import { useNavigate } from "react-router-dom";

const Header = ({ title, hoverContent }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="main-section py-12">
        <div className=" flex items-center justify-between ">
          <div className=" flex gap-2  ">
            <BackButton
              className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
              onClick={handleBack}
            />
            <h1 className="text-3xl pl-2 font-bold">{title}</h1>
            <TooltipProvider>
              <Tooltip delayDuration={20}>
                <TooltipTrigger className="flex-1">
                  {" "}
                  <HiOutlineInformationCircle size={25} />
                </TooltipTrigger>
                <TooltipContent className="content-tooltip max-w-[440px]">
                  {hoverContent}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
