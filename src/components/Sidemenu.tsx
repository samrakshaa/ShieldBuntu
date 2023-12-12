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

const menuOptions = [
  {
    title: "Network & Security",
    items: networkList,
  },
  {
    title: "Boot Settings",
    items: bootList,
  },
  {
    title: "General Settings",
    items: generalList,
  },
];

const Sidemenu = () => {
  return (
    <div className="sidemenu  overflow-auto flex flex-col gap-8 items-start w-[350px] h-full fixed top-20 left-0 bg-secondary py-10">
      {menuOptions.map((menu) => (
        <>
          <div className="flex flex-col w-full  ">
            <h3 className="text-2xl font-bold px-4 mb-3">{menu.title}</h3>
            {menu.items.map(({ title, link }) => (
              <Link
                to={link}
                className="text-md hover:bg-popover  text-foreground/50 p-2 px-4 "
              >
                {title}
              </Link>
            ))}
          </div>
        </>
      ))}
    </div>
  );
};

export default Sidemenu;
