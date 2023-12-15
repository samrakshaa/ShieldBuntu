import { IoChevronBack } from "react-icons/io5";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ButtonHTMLAttributes } from "react";
interface backBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const BackButton: React.FC<backBtnProps> = ({ ...props }) => {
  return (
    <Button {...props}>
      <IoChevronBack />
    </Button>
  );
};

export default BackButton;
