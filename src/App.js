import React, { useState } from "react";
import "./App.css";
import Welcome from "./pages/Welcome";
import Game from "./pages/Game";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [name, setName] = useState("");

  const handleChangeName = (value) => {
    setName(value);
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  return isStarted ? (
    <Game name={name} />
  ) : (
    <Welcome handleChangeName={handleChangeName} handleStart={handleStart} />
  );
}

export default App;
