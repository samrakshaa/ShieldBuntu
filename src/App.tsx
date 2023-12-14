import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Home from "./pages/home/Home";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { attachConsole } from "tauri-plugin-log-api";
import USBPage from "./pages/USBPage";
import StorageProvider from "./components/storageProvider";
import SudoDialog from "./components/SudoDialog";
import Firewall from "./pages/firewall/Firewall";
import Ssh from "./pages/ssh/Ssh";
import Dashboard from "./pages/dashboard/Dashboard";

attachConsole();
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <StorageProvider>
        <SudoDialog />
        <Router>
          <Routes>
            <Route path="/" element={<Home />}>
            <Route path={"/dashboard"} element={<Dashboard />} />

              <Route path={"/firewall"} element={<Firewall />} />
              <Route path={"/usbblock"} element={<USBPage />} />
              <Route path={"/ssh"} element={<Ssh />} />
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
