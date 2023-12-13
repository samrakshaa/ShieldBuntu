import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Firewall from "./pages/firewall/Firewall";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { info } from "tauri-plugin-log-api";
import { attachConsole } from "tauri-plugin-log-api";
import USBPage from "./pages/USBPage";
import StorageProvider from "./components/storageProvider";
import SudoDialog from "./components/SudoDialog";

attachConsole();
function App() {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <StorageProvider>
        <SudoDialog />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path={"/firewall"} element={<div>firewallsdsudsudhushdushdushdushudsuhdushdushdushdushdushu</div>} />
              <Route path={"/usbblocking"} element={<div>Usb Blocking</div>} />
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
