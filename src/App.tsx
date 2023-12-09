import { useState } from "react";

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
    <div className="container">


     

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
