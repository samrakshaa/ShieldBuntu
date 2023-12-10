import Firewall from "@/assets/firewall-icon.png";
import SSH from "@/assets/security-configuration.png";
import USB from "@/assets/usb-icon.png";
import TOR from "@/assets/settings-icon.png";
import Display from "@/assets/display-settings.png";
import Boot from "@/assets/boot-icon.png";
import Audit from "@/assets/audi-icon.png";
import Cron from "@/assets/cron-settings.png";

import { Link } from "react-router-dom";

const networkLinks = [
  {
    title: "Firewall Configution",
    alt: "firewall",
    image: Firewall,
    link: "/network-security/firewall",
  },
  {
    title: "SSH Blocking",
    alt: "ssh",
    image: SSH,
    link: "/network-security/sshblock",
  },
  {
    title: "USB Blocking",
    alt: "usb",
    image: USB,
    link: "/network-security/usbblock",
  },
  {
    title: "TOR Settings",
    alt: "tor",
    image: TOR,
    link: "/network-security/tor",
  },
  {
    title: "Open Port Settings",
    alt: "open port",
    image: TOR,
    link: "/network-security/openPort",
  },
];

const bootLinks = [
  {
    title: "Basic & Display Settings",
    alt: "display",
    image: Display,
    link: "/boot/display",
  },
  {
    title: "Advanced Boot Settings",
    alt: "adv boot",
    image: Boot,
    link: "/boot/advboot",
  },
];

const generalLinks = [
  {
    title: "Auditing",
    alt: "auditing",
    image: Audit,
    link: "/general/auditing",
  },
  {
    title: "Cron Settings",
    alt: "cron",
    image: Cron,
    link: "/general/cron",
  },
];

const Home = () => {
  return (
    <>
      <div className="home pt-32 flex flex-col gap-32 w-4/5 mx-auto py-20 md:py-10">
        <div className="network-security flex flex-col w-4/5 mx-auto">
          <h1 className="settings-header text-4xl">Network & Settings</h1>
          <p className="py-2 text-lg text-gray-400">
            Manage network settings for connectivity and security safegaurds.
          </p>
          <div className="links mt-4 flex flex-row gap-32 md:justify-between">
            {networkLinks.map(({ title, alt, image, link }) => (
              <Link
                to={link}
                className="link-item flex flex-col gap-4 justify-center items-center"
              >
                <div className="image-container p-1 h-[120px] w-[120px]">
                  <img src={image} alt={alt} className="h-full w-full" />
                </div>
                <h2>{title}</h2>
              </Link>
            ))}
          </div>
        </div>
        <div className="other-settings flex flex-row w-4/5 mx-auto justify-between">
          <div className="boot-settings">
            <h1 className="settings-header text-4xl">Boot Settings</h1>
            <p className="py-2 text-lg text-gray-400">
              Tailor your system's startup and enhance security.
            </p>
            <div className="links mt-4 flex flex-row gap-20">
              {bootLinks.map(({ title, alt, image, link }) => (
                <Link
                  to={link}
                  className="link-item flex flex-col gap-4 justify-center items-center"
                >
                  <div className="image-container p-1 h-[120px] w-[120px]">
                    <img src={image} alt={alt} className="w-full h-full" />
                  </div>
                  <h2>{title}</h2>
                </Link>
              ))}
            </div>
          </div>
          <div className="general-setetings">
            <h1 className="settings-header text-4xl">General Settings</h1>
            <p className="py-2 text-lg text-gray-400">
              Manage essential system configurations and preferences easily.
            </p>
            <div className="links mt-4 flex flex-row gap-28">
              {generalLinks.map(({ title, alt, image, link }) => (
                <Link
                  to={link}
                  className="link-item flex flex-col gap-4 justify-center items-center"
                >
                  <div className="image-container p-1 h-[120px] w-[120px]">
                    <img src={image} alt={alt} className="w-full h-full" />
                  </div>
                  <h2>{title}</h2>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
