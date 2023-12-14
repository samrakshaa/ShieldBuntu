import BackButton from "@/components/BackButton";
import Ssh from "@/components/Ssh";
import Tor from "@/components/Tor";

const Network = () => {
  return (
    <div className="mt-12 mx-auto">
      <h1 className="text-3xl font-bold px-8 flex flex-row items-center gap-4">
        <BackButton />
        Network Settings
      </h1>
      <Ssh />
      <Tor />
    </div>
  );
};

export default Network;
