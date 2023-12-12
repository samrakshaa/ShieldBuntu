import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

const SudoDialog = () => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handlePassword = () => {
    invoke("set_password", { password })
      .then((res) => console.log("password: ", res))
      .catch((err) => {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: err,
        });
      });
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Enter Password bish</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Super User Password</DialogTitle>
            <DialogDescription>Enter you one time password.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input
              id="username"
              value={password}
              className="col-span-3"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" onClick={handlePassword}>
                Authorize
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SudoDialog;
