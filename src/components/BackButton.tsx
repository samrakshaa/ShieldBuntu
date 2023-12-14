import { IoChevronBack } from "react-icons/io5";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    // window.history.back();
    navigate(-1);
  };

  return (
    <Button
      className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
      onClick={handleBack}
    >
      <IoChevronBack />
    </Button>
  );
};

export default BackButton;
