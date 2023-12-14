import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <>
      {/* basic hardening section */}
      <div className="basic-settings flex flex-col items-center mx-auto w-5/6 my-12">
        <h1 className="settings-header text-lg items-start font-bold text-primary">System Update & Cleaning</h1>
        <div className="basic-settings-content flex flex-row items-center p-4 my-4 bg-secondary/90 border-[1px] border-secondary70 w-2/3 rounded justify-between items-center">
          <p className="font-normal text-sm max-w-2/3 m-3 justify-evenly">Check relevant updates for packages and installed applications; there might be some deprecated or unused packages, which need to be deleted - click on the right to instigate upgrades and delete packages.</p>
          <div className="flex flex-col lg:flex-row items-center lg:items-end lg:justify-between mt-4 lg:mt-0">
            <Button className="font-normal text-base max-w-xl bg-secondary border-2 border-white/90 rounded text-white hover:text-[black] my-2 mx-3">Upgrade</Button>
            <Button className="font-normal text-base max-w-xl bg-primary border-2 border-secondary/90 rounded text-secondary hover:text-white my-2 mx-3">Remove</Button>
          </div>
        </div>

        {/* Dashboard section */}
        <h1 className="settings-header text-lg font-bold py-4 text-primary">System Status</h1>
        <div className="dashboard flex flex-row items-center p-4 bg-secondary/90 border-[1px] border-secondary/70 w-2/3 rounded">
          <p className="content p-50" >blah blah a lot of things go here!!</p>
        </div>
      </div>
      
    </>
  );
};

export default Dashboard;
