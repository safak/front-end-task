import React, { useCallback, useState } from "react";
import "./game.css";
import { Schedule } from "@material-ui/icons";
import CardGroup from "../components/CardGroup";

const Game = ({ name }) => {
  const [counter, setCounter] = useState(0);

  //SET SCORE FUNCTION
  const handleCounter = useCallback((second) => {
    second === 0 ? setCounter(0) : setCounter((prev) => prev + second);
  }, []);

  return (
    <div className="game">
      <div className="gameTop">
        <div className="gameTopInfo">
          <div className="gameTopLeft">
            <span className="title">Good luck, {name}!</span>
            <span className="leftSubtitle">Pick up the right cards</span>
          </div>
          <div className="gameTopRight">
            <span className="score">
              <Schedule className="timerIcon" /> Your score: {counter} seconds
            </span>
            <span className="rightSubtitle">The faster the better!</span>
          </div>
        </div>
        <CardGroup handleCounter={handleCounter} />
      </div>
    </div>
  );
};

export default Game;
