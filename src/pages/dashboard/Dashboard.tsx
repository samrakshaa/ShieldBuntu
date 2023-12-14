import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <>
      {/* basic hardening section */}
      <div className="basic-settings flex flex-col items-center h-full my-9 w-5/6">
        <h1 className="settings-header text-lg font-bold">System Update & Cleaning</h1>
        <div className="basic-settings-content flex flex-row items-center p-4 my-4 bg-secondary/90 border-2 border-black/70 w-2/3">
          <p className="font-normal text-sm max-w-xl">Check relevant updates for packages and installed applications; there might be some deprecated or unused packages, which need to be deleted - click on the right to instigate upgrades and delete packages.</p>
          <div className="ml-20 flex flex-row">
            <Button className="font-normal text-base max-w-xl bg-secondary border-2 border-white/90 rounded text-white hover:text-[black]">Upgrade</Button>
            <Button className="font-normal text-base max-w-xl bg-primary border-2 border-secondary/90 rounded text-secondary hover:text-white ml-6">Remove</Button>
          </div>
        </div>

        {/* Dashboard section */}
        <h1 className="settings-header text-lg font-bold py-4">System Status</h1>
        <div className="dashboard flex flex-row items-center p-4 bg-secondary/90 border-2 border-black/70 w-2/3">
          <p className="content p-50" >blah blah a lot of things go here!!</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
