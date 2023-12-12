import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { useTheme } from "@/components/theme-provider";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";

const Navbar = () => {
  const { setTheme } = useTheme();
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [seacrchOpen, setSearchOpen] = useState(false);

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
      <div className="flex flex-row justify-between p-4 fixed w-full backdrop-blur-xl">
        <div className="nav flex flex-row gap-8">
          <div className="nav-items flex flex-row gap-4">
            <Button onClick={onBack} variant={"outline"}>
              <IoChevronBack />
            </Button>
            <Button onClick={onNext} variant={"outline"}>
              <IoChevronForward />
            </Button>
          </div>
          <div className="breadcrumbs flex items-center text-xl">
            <Link to="/" className="hover:underline hover:text-[blue]">
              <Button variant="ghost">SECURITY</Button>
            </Link>
            {breadcrumbs.map((item, index) => (
              <>
                <span className="px-2" key={index}>
                  <IoMdArrowDropright />
                </span>
                <Link
                  to="firewall"
                  className="hover:underline hover:text-[blue]"
                >
                  <Link to="/" className="hover:underline hover:text-[blue]">
                    <Button variant="ghost">{item.toLocaleUpperCase()}</Button>
                  </Link>
                </Link>
              </>
            ))}
          </div>
        </div>
        <div className="search-bar flex flex-row gap-8 relative">
          <div className="search ml-auto flex items-center space-x-4  ">
            <Command className="w-[300px] md:w-[150px] absolute top-0 right-28  h-auto  ">
              <CommandInput
                placeholder="Type to search..."
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
              {seacrchOpen && (
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>Firewall</CommandItem>
                    <CommandItem>SSH Settings</CommandItem>
                    <CommandItem>Open Port</CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                </CommandList>
              )}
            </Command>
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
