import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/home/Home";
import "./App.css";
import { attachConsole } from "tauri-plugin-log-api";
import USBPage from "./pages/TestingArea";
import StorageProvider from "./components/storageProvider";
import SudoDialog from "./components/SudoDialog";
import Firewall from "./pages/firewall/Firewall";
import Dashboard from "./pages/dashboard/Dashboard";
import Network from "./pages/network/Network";
import TestingArea from "./pages/TestingArea";
import Usb from "./pages/usb/Usb";

attachConsole();
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <StorageProvider>
        <SudoDialog />
        <Router>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path={"/"} element={<Dashboard />} />
              <Route path={"/firewall"} element={<Firewall />} />
              <Route path={"/usb"} element={<Usb />} />
              <Route path={"/network"} element={<Network />} />
              <Route path={"/testing"} element={<TestingArea />} />
            </Route>
            {/* <Route path="/network-security/firewall" element={<Firewall />} />
            <Route path="/network-security/usbblock" element={<USBPage />} /> */}
          </Routes>
        </Router>
        <Toaster />
      </StorageProvider>
    </ThemeProvider>
  );
}

export default App;
