import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./theme-provider";

const networkList = [
  {
    title: "Firewall Configuration",
    link: "/network-security/firewall",
  },
  {
    title: "SSH/IP Blocking",
    link: "/network-security/sshblock",
  },
  {
    title: "USB Blocking",
    link: "/network-security/usbblock",
  },
  {
    title: "TOR Settings",
    link: "/network-security/tor",
  },
  {
    title: "Open Port Management",
    link: "/network-security/port",
  },
];

const bootList = [
  {
    title: "Basic & Display Settings",
    link: "/boot/display",
  },
  {
    title: "Advance Boot SEttings",
    link: "/boot/",
  },
];

const generalList = [
  {
    title: "Auditing",
    link: "/general/auditing",
  },
  {
    title: "SSH/IP Blocking",
    link: "/general/cron",
  },
];

const menuOptions = [networkList, bootList, generalList];

const Sidemenu = () => {



  return (
    <div className="sidemenu flex flex-col gap-8 items-start w-[350px] h-full fixed top-20 left-0 overflow-hidden p-8 bg-secondary">
      {menuOptions.map((menu) => (
        <div className=" mt-4">
          <h3 className="text-3xl font-bold">Network & Security</h3>
          <br />
          <div className="links flex flex-col ">
            {menu.map(({ title, link }) => (
              <Link
                to={link}
                className="text-xl hover:bg-popover rounded-xl text-foreground/50 p-4"
              >
                {title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidemenu;
