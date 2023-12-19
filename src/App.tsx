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
import Basic from "./pages/basic/Basic";
import Intermediate from "./pages/intermediate/Intermediate";
import Advance from "./pages/advance/Advance";

attachConsole();
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <LoadingScreenProvider>
        <StorageProvider>
          <SudoDialog>
            <Router>
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route path={"/"} element={<Dashboard />} />
                  <Route path={"/basic"} element={<Basic />} />
                  <Route path={"/intermediate"} element={<Intermediate />} />
                  <Route path={"/advanced"} element={<Advance />} />
                </Route>
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
