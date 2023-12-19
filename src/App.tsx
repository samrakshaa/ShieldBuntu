import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/home/Home";
import "./App.css";
import { attachConsole } from "tauri-plugin-log-api";
import StorageProvider from "./components/storageProvider";
import SudoDialog from "./components/SudoDialog";
import Firewall from "./pages/firewall/Firewall";
import Dashboard from "./pages/dashboard/Dashboard";
import Network from "./pages/network/Network";
import TestingArea from "./pages/TestingArea";
import Usb from "./pages/usb/Usb";
import LoadingScreenProvider from "./components/LoadingScreenProvider";
import SshConnect from "./pages/ssh/SshConnect";
import { Button } from "./components/ui/button";

attachConsole();
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoadingScreenProvider>
        <StorageProvider>
          <SudoDialog>
            {/* <Button className="absolute top-0 right-0">Logs</Button> */}
            <Router>
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route path={"/"} element={<Dashboard />} />
                  <Route path={"/firewall"} element={<Firewall />} />
                  <Route path={"/usb"} element={<Usb />} />
                  <Route path={"/network"} element={<Network />} />
                  <Route path={"/sshconnect"} element={<SshConnect />} />
                  <Route path={"/testing"} element={<TestingArea />} />
                </Route>
                {/* <Route path="/network-security/firewall" element={<Firewall />} />
            <Route path="/network-security/usbblock" element={<USBPage />} /> */}
              </Routes>
            </Router>
          </SudoDialog>
          <Toaster />
        </StorageProvider>
      </LoadingScreenProvider>
    </ThemeProvider>
  );
}

export default App;
