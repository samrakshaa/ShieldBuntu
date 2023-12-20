import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import { TbShieldFilled } from "react-icons/tb";

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
  console.log(pathname, "pathname");
  return (
    <div className=" overflow-visible Defend flex  border-r-2 border-secondary gap-10 items-center w-full  bg-secondary/20 justify-between p-4 sticky top-0 left-0 backdrop-blur-2xl ">
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
      <div className="absolute top-24  w-screen left-0 flex justify-center items-center">
        {pathname != "/" && (
          <div className="categories bg-secondary rounded-3xl w-full max-w-[1000px] p-2  mx-6 drop-shadow-3xl shadow-2xl ">
            {/* <h2 className="text-xl font-bold p-4 ">Hardening</h2> */}
            <div className="flex  gap-2  ">
              {menuOptions.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  to={item.link}
                  className={`rounded-2xl ${
                    pathname === item.link
                      ? "bg-primary"
                      : "hover:bg-gray-400/10"
                  } text-foreground p-2 px-6 flex gap-2 items-center w-full text-2xl font-black justify-center `}
                >
                  {item.icon && item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex absolute top-0 left-0 w-screen  justify-center items-center h-full ">
        <Link
          to={"/"}
          className={`${"hover:bg-secondary/50"} text-foreground p-4 px-6 flex gap-2 items-center  text-2xl rounded-xl `}
        >
          <MdDashboard />
          Dashboard
        </Link>
        <Link
          to={"/basic"}
          className={`${"hover:bg-secondary/50"} text-foreground p-4 px-6 flex gap-2 items-center  text-2xl rounded-xl `}
        >
          <TbShieldFilled />
          Hardening
        </Link>
      </div>
    </div>
  );
};

export default Sidemenu;
