import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";

interface MenuItem {
  title: string;
  link: string;
  icon?: ReactNode;
}

interface SidemenuProps {
  menuOptions: MenuItem[];
}

const Sidemenu: React.FC<SidemenuProps> = ({ menuOptions }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className=" overflow-auto Defend flex flex-col border-r-2 border-secondary gap-4 items-center w-full max-w-[250px] bg-secondary/20 py-10 h-auto">
      <Link to={"/"} className=" px-4 text-2xl">
        ShieldBuntu
      </Link>
      <Link
        to={"/"}
        className={`${"hover:bg-secondary/50"} text-foreground p-4 px-6 flex gap-2 items-center w-full`}
      >
        <MdDashboard />
        Dashboard
      </Link>
      <div className="categories bg-secondary rounded-md w-5/6 p-2">
        <h2 className="text-lg font-bold p-4 ">Categories</h2>
        {menuOptions.map((item, itemIndex) => (
          <Link
            key={itemIndex}
            to={item.link}
            className={`${
              pathname === item.link
                ? "hover:bg-primary/80 bg-primary"
                : "hover:bg-secondary/50"
            } text-foreground p-4 px-6 flex gap-2 items-center w-full`}
          >
            {item.icon && item.icon}
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
