import React from "react";
import "./welcome.css"

const Welcome = ({ handleChangeName, handleStart }) => {

  return (
    <div className="welcome">
      <span className="greeting">Hello friend, tell me your name...</span>
      <input
        className="input"
        placeholder="Your name here"
        onChange={(e) => handleChangeName(e.target.value)}
      />
      <button className="startButton" onClick={handleStart}>Let's go 🠪</button>
    </div>
  );
};

export default Welcome;
