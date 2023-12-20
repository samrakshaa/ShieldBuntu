import StatusOfAll from "@/components/statusOfAll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi";
// import { Button } from "@/components/ui/button";
// import useLoading from "@/hooks/useLoading";
// import { invoke } from "@tauri-apps/api/tauri";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  // const [username, setUsername] = useState("");
  // const { isLoading, execute: checkUsername } = useLoading({
  //   functionToExecute: () => invoke("check_username"),
  //   onSuccess: (res: any) => {
  //     const resJSON = JSON.parse(res);
  //     setUsername(resJSON.username)
  //   },
  //   onError: (err) => {
  //     console.log(err);
  //   },
  // });
  // useEffect(() => {
  //   checkUsername();
  // }, [])

  // const { isLoading: removeUnusedLoading, execute: removeUnsedPackages } =
  //   useLoading({
  //     functionToExecute: () => invoke("remove_unused_packages"),
  //     onSuccess: (res: any) => {
  //       toast({
  //         variant: "default",
  //         title: " Success!",
  //         description: " Unused packages removed successfully",
  //         className: "border-emerald-500 bg-emerald-700/10 ",
  //       });
  //       console.log(res);
  //     },
  //     onError: (err) => {
  //       console.log(err);
  //     },
  //   });

  // const { isLoading: packagesUpdateLoading, execute: updatePackages } =
  //   useLoading({
  //     functionToExecute: () => invoke("update_and_upgrade_packages"),
  //     onSuccess: (res: any) => {
  //       toast({
  //         variant: "default",
  //         title: " Success!",
  //         description: " updated system & packages successfully",
  //         className: "border-emerald-500 bg-emerald-700/10 ",
  //       });
  //     },
  //     onError: (err) => {
  //       console.log(err, "error");
  //     },
  //   });

  return (
    <>
      {/* basic hardening section */}
      <div className="basic-settings flex flex-col mt-12 px-6 mx-auto max-w-[900px]">
        <div>
          <h1 className="settings-header text-lg font-bold mb-2">Status</h1>
          <StatusOfAll />
        </div>
        <br />
        {/* <div className="flex flex-col">
          <h1 className="settings-header text-lg font-bold">
            System Update & Cleaning
          </h1>
          <div className="basic-settings-content flex flex-row items-center p-2 my-4 bg-secondary/60 border-[1px] border-secondary rounded-lg justify-between">
            <p className="font-normal max-w-2/3 m-3 justify-evenly">
              Check relevant updates for packages and installed applications;
              there might be some deprecated or unused packages, which need to
              be deleted - click on the right to instigate upgrades and delete
              packages.
            </p>
            <div className="flex flex-col lg:flex-row items-center lg:items-end lg:justify-between mt-4 lg:mt-0">
              <Button
                className="font-normal text-base max-w-xl bg-secondary border-2 border-white/90 rounded
              hover:bg-secondary/50 my-2 mx-3"
                onClick={updatePackages}
              >
                {packagesUpdateLoading ? "Updating..." : "Update Packages"}
              </Button>
              <Button
                className="max-w-xl bg-primary borderW-2 border-secondary/90 rounded hover:bg-primary/80 my-2 mx-3"
                disabled={removeUnusedLoading}
                onClick={removeUnsedPackages}
              >
                {removeUnusedLoading ? "Removing..." : "Remove Unused Packages"}
              </Button>
            </div>
          </div>
        </div> */}
        <div className="firewall flex flex-row justify-center mx-auto max-w-[900px]">
          <div className="main-section pt-8">
            <div className=" flex items-center justify-between ">
              <div className=" flex gap-2  ">
                {/* <BackButton
              className="bg-secondary text-2xl py-0 hover:bg-secondary/50"
              onClick={handleBack}
            /> */}
                <h1 className="text-2xl text-primary font-bold">
                  Configuration Export
                </h1>
                <TooltipProvider>
                  <Tooltip delayDuration={20}>
                    <TooltipTrigger className="flex-1">
                      {" "}
                      <HiOutlineInformationCircle size={25} />
                    </TooltipTrigger>
                    <TooltipContent className="content-tooltip max-w-[440px]">
                    Export current hardened system settings for reference in securing other systems.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <p className="py-2 text-foreground/50 leading-6">
              The 'Export Current Configuration' function captures and saves the current fortified system setup into a file, offering a comprehensive reference guide for configuring and securing other systems based on established hardened settings.
            </p>
            <br />
            <div className="toggle-firewall bg-secondary/60 mt-2 p-2 px-4 text-lg border-2 rounded-lg flex flex-row justify-between items-center">
              <div className="flex flex-row items-center">
                <p>Export your current configuration</p>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
