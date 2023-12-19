import { Outlet } from "react-router-dom";
import Sidemenu from "@/components/Sidemenu";
import { MdDashboard } from "react-icons/md";
import { TbUsb, TbBrandPowershell } from "react-icons/tb";
import { SiFirewalla, SiTorbrowser } from "react-icons/si";
import { PiWallFill } from "react-icons/pi";

// interface MenuItem {
//   title: string;
//   link: string;
//   icon?: ReactNode;
// }

const networkLinks = [
  {
    title: "Basic",
    link: "/basic",
    icon: <PiWallFill size={25} />,
  },
  {
    title: "Moderate",
    link: "/intermediate",
    icon: <TbUsb size={25} />,
  },
  {
    title: "Expert",
    link: "/advanced",
    icon: <SiTorbrowser size={25} />,
  },
];

const Home = () => {
  return (
    <>
      <div className="home flex h-screen mx-auto">
        <Sidemenu menuOptions={networkLinks} />
        <div className="overflow-auto w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
