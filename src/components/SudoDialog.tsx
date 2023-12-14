// Import statements
import { useState, useEffect, FormEvent } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
import useLoading from "../hooks/useLoading";

const SudoDialog = () => {
  const [password, setPassword] = useState("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const { toast } = useToast();
  const { isLoading, execute } = useLoading({
    functionToExecute: () => invoke("set_password", { password }),
    onSuccess: () => {
      console.log("Authorized");
      setPassword("");
      setIsDialogOpen(false);
    },
    onError: (err) => {
      console.log(err);
      setPassword("");
      toast({
        variant: "destructive",
        title: "Wrong Password",
        description: `You have entered wrong Password. Only ${
          attemptsRemaining - 1
        } chances left.`,
      });
    },
  });

  useEffect(() => {
    if (attemptsRemaining < 1) {
      console.log("Closing app due to too many failed attempts");
      appWindow.close();
    }
  }, [attemptsRemaining]);

  const handlePassword = (e: FormEvent) => {
    e.preventDefault();
    setAttemptsRemaining((prev) => prev - 1);
    execute();
  };

  return (
    <div>
      <Dialog open={isDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Super User Password</DialogTitle>
            <DialogDescription>Enter your one-time password.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePassword}>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                className="col-span-3"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {/* features-to-work-on: Add a loading spinner */}
                {isLoading ? "Authorizing..." : "Authorize"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SudoDialog;
