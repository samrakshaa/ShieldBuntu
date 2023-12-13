import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./theme-provider";

interface MenuItem {
  title: string;
  link: string;
  icon?: ReactNode;
}

interface SidemenuProps {
  menuOptions: MenuItem[];
}

const Sidemenu: React.FC<SidemenuProps> = ({menuOptions}) => {
  return (
    <div className=" overflow-auto flex flex-col gap-8 items-start w-full max-w-[350px] bg-secondary py-10 h-auto">
      {menuOptions.map((item, itemIndex) => (
       
          <Link
            key={itemIndex}
            to={item.link}
            className="text-xl hover:bg-popover text-foreground/50 p-4 px-6 flex gap-2 items-center w-full"
          >
            {item.icon && item.icon}
            {/* Display icon */}
            {item.title}
          </Link>
       
      ))}
    </div>
  );
};

export default Sidemenu;
