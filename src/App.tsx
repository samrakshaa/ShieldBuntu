import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import "./App.css";
import { attachConsole } from "tauri-plugin-log-api";
import StorageProvider from "./components/storageProvider";
import SudoDialog from "./components/SudoDialog";
import Intro from "./pages/intro/Intro"; // Import the Intro component
import Home from "./pages/home/Home";
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
              {/* Define nested routes under the Home component */}
              <Route index element={<Dashboard />} />
              <Route path="firewall" element={<Firewall />} />
              <Route path="usb" element={<Usb />} />
              <Route path="network" element={<Network />} />
              <Route path="testing" element={<TestingArea />} />
              {/* Other nested routes under Home */}
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </StorageProvider>
    </ThemeProvider>
  );
}

export default App;
