import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

interface MenuItem {
  title: string;
  link: string;
  icon?: ReactNode;
}

interface SidemenuProps {
  menuOptions: MenuItem[];
}

const Sidemenu: React.FC<SidemenuProps> = ({ menuOptions }) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleClick = (index: number) => {
    setActiveTab(index);
    console.log(index);
  };

  return (
    <div className=" overflow-auto flex flex-col border-r-2 border-secondary gap-8 items-start w-full max-w-[250px] bg-secondary/20 py-10 h-auto">
      <Link to={"/"} className=" px-4 text-2xl">
        DefendOS
      </Link>
      {menuOptions.map((item, itemIndex) => (
        <Link
          key={itemIndex}
          to={item.link}
          onClick={() => handleClick(itemIndex)}
          className={`${
            activeTab === itemIndex
              ? "hover:bg-primary/80 bg-primary"
              : "hover:bg-secondary/50"
          } text-foreground p-4 px-6 flex gap-2 items-center w-full`}
        >
          {item.icon && item.icon}
          {/* Display icon */}
          {item.title}
        </Link>
      ))}
    </div>
  );
};

export default Sidemenu;
