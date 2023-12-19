import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGStore } from "@/store";

const Intro = () => {
  const navigate = useNavigate();
  const { setFlow } = useGStore();

  const handleFlow1 = () => {
    navigate("/client");
    setFlow("local");
  };
  const handleFlow2 = () => {
    navigate("/client");
    setFlow("remote");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row gap-12">
        <Button className="btn btn-primary p-8 text-3xl" onClick={handleFlow1}>
          Configure your Machine
        </Button>
        <Button className="btn btn-primary p-8 text-3xl" onClick={handleFlow2}>
          Configure Remote Machine(s)
        </Button>
      </div>
    </div>
  );
};

export default Intro;
