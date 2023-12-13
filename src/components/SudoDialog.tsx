import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoke } from "@tauri-apps/api/tauri";
import { FormEvent, useEffect, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { useToast } from "./ui/use-toast";

const SudoDialog = () => {
  const [password, setPassword] = useState("");
  const [isdialogOpen, setIsDialogOpen] = useState(true);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const { toast } = useToast();

  const handlePassword = (e: FormEvent) => {
    e.preventDefault();
    setAttemptsRemaining((prev) => prev - 1);
    invoke("set_password", { password })
      .then(() => {
        setIsDialogOpen(false);
        console.log("Authorized");
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: "destructive",
          title: "Wrong Password",
          description: `You have entered wrong Password. Only ${attemptsRemaining} chances left.`,
        });
      });
  };

  useEffect(() => {
    const closeApp = async () => {
      if (attemptsRemaining < 1) {
        console.log(attemptsRemaining - 1);
        await appWindow.close();
      }
    };

    closeApp();
  }, [attemptsRemaining]);

  return (
    <div>
      <Dialog open={isdialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Super User Password</DialogTitle>
            <DialogDescription>Enter you one time password.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePassword}>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="username" className="text-right">
                Password
              </Label>
              <Input
                type="password"
                id="username"
                value={password}
                className="col-span-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Authorize</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SudoDialog;
