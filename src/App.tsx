import { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Firewall from "./components/firewall/Firewall";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import { info } from "tauri-plugin-log-api";
import { attachConsole } from "tauri-plugin-log-api";

attachConsole();
function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    const msg: string = await invoke("greet", { name });
    msg && setGreetMsg(msg);
    info(`${msg} - this is from nodejs `);
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/network-security/firewall" element={<Firewall />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
