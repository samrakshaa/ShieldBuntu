import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const { setTheme } = useTheme();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    const breadslices = location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    setBreadcrumbs(breadslices);
  }, [location]);

  const onBack = () => {
    window.history.back();
  };

  const onNext = () => {
    window.history.forward();
  };

  return (
    <>
      <div className="flex flex-row justify-between p-4 fixed w-full">
        <div className="nav flex flex-row gap-8">
          <div className="nav-items flex flex-row gap-4">
            <Button onClick={onBack}>
              <IoChevronBack />
            </Button>
            <Button onClick={onNext}>
              <IoChevronForward />
            </Button>
          </div>
          <div className="breadcrumbs flex items-center text-xl">
            <Link to="/" className="hover:underline hover:text-[blue]">
              SECURITY
            </Link>
            {breadcrumbs.map((item) => (
              <>
                <span className="px-2">{">"}</span>
                <Link
                  to="firewall"
                  className="hover:underline hover:text-[blue]"
                >
                  {item.toLocaleUpperCase()}
                </Link>
              </>
            ))}
          </div>
        </div>
        <div className="search-bar flex flex-row gap-8">
          <div className="search ml-auto flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[300px] md:w-[150px]"
            />
          </div>
          <div className="toggle-mode">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <FaSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <FaMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
