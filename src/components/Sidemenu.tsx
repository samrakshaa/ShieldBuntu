import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./theme-provider";

interface MenuItem {
  title: string;
  link: string;
  icon?: ReactNode;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface SidemenuProps {
  menuOptions: MenuCategory[];
}



const Sidemenu: React.FC<SidemenuProps> = ({menuOptions}) => {
  return (
    <div className=" overflow-auto flex flex-col gap-8 items-start w-[350px] h-full fixed top-20 left-0 bg-secondary py-10">
      {menuOptions.map((menu, menuIndex) => (
        <div key={menuIndex} className="flex flex-col w-full">
          <h3 className="text-2xl font-bold px-4 mb-3">{menu.title}</h3>
          {menu.items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              to={item.link}
              className="text-xl hover:bg-popover text-foreground/50 p-4 px-6 flex gap-2 items-center "
            >
              {item.icon && item.icon}
              {/* Display icon */}
              {item.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidemenu;
