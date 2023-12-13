import { useEffect, useState } from "react";
import Sidemenu from "../../components/Sidemenu";
import { Switch } from "@/components/ui/switch";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { invoke } from "@tauri-apps/api/tauri";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GiSheikahEye } from "react-icons/gi";

const networkList = [
  {
    title: "Firewall Configuration",
    link: "/network-security/firewall",
    icon: <GiSheikahEye />,
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

const Firewall = () => {
  const [isFirewallEnabled, setIsFirewallEnabled] = useState(false);
  const [firewallRules, setFirewallRules] = useState([]);
  const [isLoadingFirewall, setIsLoadingFirewall] = useState(false);
  const { toast } = useToast();

  const handleSwitchChange = () => {
    if (!isFirewallEnabled) {
      console.log("trying to enable firewall");

      setIsLoadingFirewall(true);
      invoke("apply_firewall_rules")
        .then((res) => {
          if (res === "true") {
            console.log("firewall on");
            setIsFirewallEnabled((prevState) => !prevState);
          } else {
            console.log("not able to enable firewall");
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Not able to enable/disable firewall.",
            });
          }
        })
        .catch(() => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        });
      setIsLoadingFirewall(false);
    } else {
      console.log("reverse_firewall_rules");

      setIsLoadingFirewall(true);
      invoke("reverse_firewall_rules")
        .then((res) => {
          if (res === "true") {
            console.log("firewall off");
            setIsFirewallEnabled((prevState) => !prevState);
          } else {
            console.log("not able to disable firewall");
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Not able to enable/disable firewall.",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        });
      setIsLoadingFirewall(false);
    }
  };

  return (
    <div className="firewall flex flex-row items-center">
      <div className="main-section py-12">
        <div className=" flex gap-2  items-center ">
          <h1 className="text-4xl text-primary font-bold">
            Firewall Configuration{" "}
          </h1>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger className="">
                {" "}
                <HiOutlineInformationCircle size={25} />
              </TooltipTrigger>
              <TooltipContent>Hover</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-lg py-2 text-foreground/60 leading-6">
          Control network ports and firewall rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <br />
        <div className="toggle-firewall mt-4 p-2 px-4 text-xl border-2 rounded-lg flex flex-row justify-between items-center">
          <p>Enable/Disable Firewall</p>
          <Switch
            checked={isFirewallEnabled}
            disabled={isLoadingFirewall}
            onClick={handleSwitchChange}
          />
        </div>
        {/* Checking for UFM installation */}
        <div className="checkingUfm ">
          <div className="install mt-4 flex flex-row gap-2">
            {/* color change needed here */}
            <Button className="text-lg px-8 text-white" variant={"outline"}>
              Check
            </Button>
            <Button className="text-lg px-8">Install</Button>
          </div>
        </div>
        <br />
        {/* IP table config */}
        <div className="iptable mt-12">
          <h2 className="text-2xl mb-4 font-bold ">IP Table Configuration</h2>
          <Table className="">
            {/* <TableCaption>IP table rules.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-xl" colSpan={2}>
                  Custom IP table rules
                  <Button className="absolute right-0 top-0">
                    View Current Rules
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Add more rules</TableCell>
                <TableCell className="relative">
                  <Button className="absolute right-0 top-0">ADD</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Firewall;
