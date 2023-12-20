import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { HiOutlineInformationCircle } from "react-icons/hi";
import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import RefreshButton from "./refreshButton";
import Loader from "./Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {};

function GrubPass({}: Props) {
  const [isGrubPass, setIsGrubPass] = useState(false);
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoading: grubLoading, execute: checkGrubStatus } = useLoading({
    functionToExecute: () => invoke("grub_pass_check"),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);

      if (resJSON.success) {
        setIsGrubPass(true);
      } else {
        setIsGrubPass(false);
      }
    },
  });
  const { isLoading: addGrubPassLoading, execute: addGrubPass } = useLoading({
    functionToExecute: () => invoke("grub_pass_add", { pass: password }),
    onSuccess: (res: any) => {
      const resJSON = JSON.parse(res);
      console.log("Added grub pass", resJSON);
      if (resJSON.success) {
        setIsGrubPass(true);
        setPassword("");
      } else {
        setIsGrubPass(false);
      }
    },
  });

  const handleSubmit = () => {
    setIsDialogOpen(false);
    addGrubPass();
  };

  useEffect(() => {
    checkGrubStatus();
  }, []);
  console.log(password);
  return (
    <div className="firewall flex flex-row justify-center mx-auto max-w-[900px]">
      <div className="main-section pt-8">
        <div className=" flex items-center justify-between ">
          <div className=" flex gap-2 items-center  ">
            <h1 className="text-2xl text-primary font-bold">
              Grub Password Configuration
            </h1>
            <TooltipProvider>
              <Tooltip delayDuration={20}>
                <TooltipTrigger className="">
                  {" "}
                  <HiOutlineInformationCircle size={25} />
                </TooltipTrigger>
                <TooltipContent className="content-tooltip max-w-[440px]">
                  Grub Password Configuration: Easily set a password to secure
                  the GRUB bootloader with just a few clicks.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RefreshButton
            loading={grubLoading}
            onClick={() => checkGrubStatus()}
          />
        </div>
        <p className="py-2 text-foreground/50 leading-6">
          Easily fortify system security by setting a GRUB bootloader password
          using a simplified interface, enhancing defense against unauthorized
          access or system alterations.
        </p>
        <br />
        <div className="toggle-firewall bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
          <div className="flex flex-row items-center">
            <p>Add Grub Password</p>
            {grubLoading && <Loader />}
          </div>

          <Dialog open={isDialogOpen}>
            <DialogTrigger>
              <Button
                className="font-normal text-base max-w-xl bg-secondary border-2 border-white/90 rounded
              hover:bg-secondary/50 my-2 mx-3"
                onClick={() => setIsDialogOpen(true)}
              >
                {addGrubPassLoading
                  ? "Adding..."
                  : isGrubPass
                  ? "Update Password"
                  : "Add a password"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Enter you new grub password</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => handleSubmit()}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <br />
      </div>
    </div>
  );
}

export default GrubPass;
