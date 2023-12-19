import StatusOfAll from "@/components/statusOfAll";
import { Button } from "@/components/ui/button";
import useLoading from "@/hooks/useLoading";
import { invoke } from "@tauri-apps/api/tauri";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

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

  const { isLoading: removeUnusedLoading, execute: removeUnsedPackages } =
    useLoading({
      functionToExecute: () => invoke("remove_unused_packages"),
      onSuccess: (res: any) => {
        toast({
          variant: "default",
          title: " Success!",
          description: " Unused packages removed successfully",
          className: "border-emerald-500 bg-emerald-700/10 ",
        });
        console.log(res);
      },
      onError: (err) => {
        console.log(err);
      },
    });

  const { isLoading: packagesUpdateLoading, execute: updatePackages } =
    useLoading({
      functionToExecute: () => invoke("update_and_upgrade_packages"),
      onSuccess: (res: any) => {
        toast({
          variant: "default",
          title: " Success!",
          description: " updated system & packages successfully",
          className: "border-emerald-500 bg-emerald-700/10 ",
        });
      },
      onError: (err) => {
        console.log(err, "error");
      },
    });

  return (
    <>
      {/* basic hardening section */}
      <div className="basic-settings flex flex-col mt-12 px-6 mx-auto max-w-[900px]">
        <div>
          <h1 className="settings-header text-lg font-bold mb-2">Status</h1>
          <StatusOfAll />
        </div>
        <br />
        <div className="flex flex-col">
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
        </div>

        {/* Dashboard section */}
        <div className="flex flex-col">
          <h1 className="settings-header text-lg font-bold py-4">
            System Status
          </h1>
          <div className="dashboard flex flex-row items-center p-4 bg-secondary/90 border-[1px] border-secondary/70 rounded-lg">
            <p className="content p-50">blah blah a lot of things go here!!</p>
          </div>
        </div>

        {/* kernel section */}
        <div className="flex flex-col">
          <h1 className="settings-header text-lg font-bold py-4">
            Kernel Parameters
          </h1>
          <div className="dashboard flex flex-row items-center p-4 bg-secondary/90 border-[1px] border-secondary/70 rounded-lg">
            <p className="content p-50">
              Enhances the security of a Linux system by configuring various
              kernel parameters related to network security and system
              protection.
            </p>
          </div>
        </div>

        {/* kernel section */}
        <div className="flex flex-col">
          <h1 className="settings-header text-lg font-bold py-4">
            Status of your device
          </h1>
          <div className="dashboard flex flex-row items-center p-4 bg-secondary/90 border-[1px] border-secondary/70 rounded-lg">
            <p className="content p-50">
              Enhances the security of a Linux system by configuring various
              kernel parameters related to network security and system
              protection.
            </p>
          </div>
        </div>

        <br />
        <br />
      </div>
    </>
  );
};

export default Dashboard;
