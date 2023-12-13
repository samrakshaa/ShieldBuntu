import Firewall from "@/assets/firewall-icon.png";
import SSH from "@/assets/security-configuration.png";
import USB from "@/assets/usb-icon.png";
import TOR from "@/assets/settings-icon.png";
import Display from "@/assets/display-settings.png";
import Boot from "@/assets/boot-icon.png";
import Audit from "@/assets/audi-icon.png";
import Cron from "@/assets/cron-settings.png";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import Sidemenu from "@/components/Sidemenu";

// interface MenuItem {
//   title: string;
//   link: string;
//   icon?: ReactNode;
// }

const networkLinks = [
  {
    title: "Firewall",
    link: "/firewall",
  },
  {
    title: "SSH Blocking",

    link: "/",
  },
  {
    title: "USB Blocking",

    link: "/",
  },
  {
    title: "TOR Settings",

    link: "/",
  },
  {
    title: "Open Port Settings",
    link: "/",
  },
];

// const bootLinks = [
//   {
//     title: "Basic & Display Settings",
//     alt: "display",
//     image: Display,
//     link: "/boot/display",
//   },
//   {
//     title: "Advanced Boot Settings",
//     alt: "adv boot",
//     image: Boot,
//     link: "/boot/advboot",
//   },
// ];

// const generalLinks = [
//   {
//     title: "Auditing",
//     alt: "auditing",
//     image: Audit,
//     link: "/general/auditing",
//   },
//   {
//     title: "Cron Settings",
//     alt: "cron",
//     image: Cron,
//     link: "/general/cron",
//   },
// ];

const Home = () => {
  return (
    <>
      <div className="home flex  h-full gap-32  mx-auto ">
        <Sidemenu menuOptions={networkLinks} />
        <Outlet />
      </div>
    </>
  );
};

export default Home;
