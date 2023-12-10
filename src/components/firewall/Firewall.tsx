import { useEffect, useState } from "react";
import Sidemenu from "../sidemenu/Sidemenu";
import { Switch } from "@/components/ui/switch";
import { Button } from "../ui/button";

const Firewall = () => {
  const [isFirewallEnabled, setIsFirewallEnabled] = useState(false);

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
        <h2 className="text-2xl text-[#326690]">IP Table Configuration</h2>
           <table className="w-11/12 border-sky-700 bg-white rounded-lg mt-4">
            <thead className="bg-blue-50">
                <tr className="h-16">
                    <th className="py-2 px-4 border-b border-gray-300 text-left">
                    {/* <button className="rounded border border-gray-400 px-4 py-2">View Current Rules</button> */}
                      CUSTOM IP TABLE RULES
                      </th>
                      <th className="py-2 px-4 border-b text-right">
                        <button className="rounded border border-gray-400 bg-white px-8 py-0">View Current Rules</button>
                    </th>
                </tr>
            </thead>
            <tbody className="w-max">
                <tr className="border-2 rounded m-2 flex items-center justify-between m-2">
                <td className="py-2 px-4">
                        <span>Row 1</span>
                        <button className="rounded border border-gray-400 px-3 py-1">Action</button>
                    </td>
                </tr>
                <tr className="flex flex-row justified-between border-2 rounded m-2">
                    <td className="py-2 px-4">Row 2</td>
                </tr>
                <tr className="flex flex-row justified-between border 2 rounded m-2">
                    <td className="py-2 px-4">Row 3</td>
                </tr>
            </tbody>
        </table>
        </div>
      </div>
    </div>
         
  );
};

export default Firewall;
