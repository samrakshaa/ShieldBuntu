import { Outlet } from "react-router-dom";
import Sidemenu from "@/components/Sidemenu";
import { MdDashboard } from "react-icons/md";
import { TbUsb, TbBrandPowershell } from "react-icons/tb";
import { SiFirewalla, SiTorbrowser } from "react-icons/si";
import { PiWallFill } from "react-icons/pi";
import { GiRank1 } from "react-icons/gi";
import { GiRank2 } from "react-icons/gi";
import TestingArea from "@/pages/TestingArea";

// interface MenuItem {
//   title: string;
//   link: string;
//   icon?: ReactNode;
// }

const networkLinks = [
  {
    title: "Level 1",
    link: "/basic",
    icon: <GiRank1 size={25} />,
  },

  {
    title: "Level 2",
    link: "/advanced",
    icon: <GiRank2 size={25} />,
  },
];

const Home = () => {
  return (
    <>
      <div className="home   h-screen mx-auto">
        <Sidemenu menuOptions={networkLinks} />
<<<<<<< Updated upstream
        {/* <TestingArea  /> */}

        <div className="overflow-auto w-full px-8">
          

=======
        {/* <TestingArea /> */}
        <div className="overflow-auto w-full">
>>>>>>> Stashed changes
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
