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

const Firewall = () => {
  const [isFirewallEnabled, setIsFirewallEnabled] = useState(false);
  const [firewallRules, setFirewallRules] = useState([]);

  const handleSwitchChange = () => {
    setIsFirewallEnabled((prevState) => !prevState);
  };

  return (
    <div className="firewall flex flex-row items-center pt-20">
      <Sidemenu />
      <div className="main-section p-12 ml-[400px] w-3/5">
        <h1 className="text-4xl">Firewall Configuration</h1>
        <p className="text-lg py-2 text-gray-600">
          Control network ports and firewall rules with UFW. Allow/deny specific
          ports, protocols. Use iptables for advanced rules. Install, configure,
          manage. Ensure network security.
        </p>
        <div className="toggle-firewall mt-4 p-2 px-4 text-2xl border-2 rounded-lg flex flex-row justify-between items-center">
          <p>Enable/Disable Firewall</p>
          <Switch
            checked={isFirewallEnabled}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        {/* Checking for UFM installation */}
        <div className="checkingUfm mt-12">
          <h2 className="text-2xl text-[#326690]">
            Is UFM( Uncomplicated Firewall ) installed?
          </h2>
          <div className="install mt-4 flex flex-row gap-8">
            {/* color change needed here */}
            <Button className="text-lg px-8 bg-[#326690] text-white">
              Check
            </Button>
            <Button className="text-lg px-8">Install</Button>
          </div>
        </div>

        {/* IP table config */}
        <div className="iptable mt-12">
          <h2 className="text-2xl mb-4 text-[#326690]">
            IP Table Configuration
          </h2>
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
