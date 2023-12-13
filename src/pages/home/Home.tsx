import { Outlet } from "react-router-dom";
import Sidemenu from "@/components/Sidemenu";

// interface MenuItem {
//   title: string;
//   link: string;
//   icon?: ReactNode;
// }

const networkLinks = [
  {
    title: "Dashboard",
    link: "/",
  },
  {
    title: "Firewall",
    link: "/firewall",
  },
  {
    title: "SSH Blocking",

    link: "/ssh",
  },
  {
    title: "USB Blocking",

    link: "/",
  },
  {
    title: "TOR Settings",

    link: "/usbblock",
  },
  {
    title: "Open Port Settings",
    link: "/",
  },
];

const Home = () => {
  return (
    <>
      <div className="home flex h-full mx-auto ">
        <Sidemenu menuOptions={networkLinks} />
        <Outlet />
      </div>
    </>
  );
};

export default Home;
