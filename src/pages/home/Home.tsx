import { Outlet } from "react-router-dom";
import Sidemenu from "@/components/Sidemenu";
import { MdDashboard } from "react-icons/md";
import { TbUsb } from "react-icons/tb";
import { SiFirewalla, SiTorbrowser } from "react-icons/si";

// interface MenuItem {
//   title: string;
//   link: string;
//   icon?: ReactNode;
// }

const networkLinks = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <MdDashboard size={25} />,
  },
  {
    title: "Firewall",
    link: "/firewall",
    icon: <SiFirewalla size={25} />,
  },
  {
    title: "USB Settings",
    link: "/usbblock",
    icon: <TbUsb size={25} />,
  },
  {
    title: "Network Settings",
    link: "/network",
    icon: <SiTorbrowser size={25} />,
  },
  // {
  //   title: "Open Port Settings",
  //   link: "/",
  // },
];

const Home = () => {
  return (
    <>
      <div className="home flex h-full mx-auto">
        <Sidemenu menuOptions={networkLinks} />
        <Outlet />
      </div>
    </>
  );
};

export default Home;
