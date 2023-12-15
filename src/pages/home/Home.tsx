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
    title: "Dashboard",
    link: "/",
    icon: <MdDashboard size={25} />,
  },
  {
    title: "Firewall",
    link: "/firewall",
    icon: <PiWallFill size={25} />,
  },
  {
    title: "USB Settings",
    link: "/usb",
    icon: <TbUsb size={25} />,
  },
  {
    title: "Network Settings",
    link: "/network",
    icon: <SiTorbrowser size={25} />,
  },
  {
    title: "SSH Connect",
    link: "/sshconnect",
    icon: <TbBrandPowershell size={25} />,
  },
  {
    title: "Testing Area",
    link: "/testing",
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
        <div className="overflow-auto w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
