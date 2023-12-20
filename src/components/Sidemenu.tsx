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
    <div className=" overflow-auto Defend flex  border-r-2 border-secondary gap-10 items-center w-full  bg-secondary/20 justify-between p-4 sticky top-0 left-0 backdrop-blur-2xl ">
      <Link
        to={"/"}
        className=" px-4 text-2xl flex gap-2 justify-center items-center font-black "
      >
        <img
          src="shield.svg"
          alt="logo"
          className=" bg-blend-soft-light "
          width={"  40px"}
        />
        ShieldBuntu
      </Link>
      <br />
     
      <div className="categories bg-secondary rounded-md w-5/6 p-2">
        {/* <h2 className="text-xl font-bold p-4 ">Hardening</h2> */}
        <div className="flex  gap-2">
          {menuOptions.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              to={item.link}
              className={`rounded-lg ${
                pathname === item.link ? "bg-primary" : "hover:bg-gray-400/10"
              } text-foreground p-2 px-6 flex gap-2 items-center w-full text-2xl font-black justify-center`}
            >
              {item.icon && item.icon}
              {item.title}
            </Link>
          ))}
        </div>
        
      </div>
      <Link
        to={"/"}
        className={`${"hover:bg-secondary/50"} text-foreground p-4 px-6 flex gap-2 items-center  text-2xl`}
      >
        <MdDashboard />
        Dashboard
      </Link>
    </div>
  );
};

export default Sidemenu;
