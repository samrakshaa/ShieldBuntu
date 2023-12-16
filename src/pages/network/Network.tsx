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
      <h1 className="text-3xl font-bold px-8 flex flex-row items-center gap-4 ">
        <BackButton
          className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
          onClick={handleBack}
        />
        Network Settings
      </h1>
      <Ssh />
      <Tor />
    </div>
  );
};

export default Network;
