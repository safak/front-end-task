import React, { useCallback, useEffect, useRef, useState } from "react";
import "./cardGroup.css";
import Z from "../assets/zoovu-z.svg";
import O from "../assets/zoovu-o.svg";
import V from "../assets/zoovu-v.svg";
import U from "../assets/zoovu-u.svg";

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CORRECT_ARRAY = [["Z"], ["O", "O2"], ["O", "O2"], ["V"], ["U"]];
const checkCorrect = (array) => {
  let flag = true;
  CORRECT_ARRAY.map((value, index) => {
    const found = array.some(
      (item) => item.index === index.toString() && value.includes(item.letter)
    );
    if (!found) {
      flag = false;
    }
  });
  return flag;
};

const checkMove = (move) => {
  return CORRECT_ARRAY.some(
    (value, index) =>
      move.index === index.toString() && value.includes(move.letter)
  );
};

const CardGroup = ({ handleCounter }) => {
  const cardArray = [
    { letter: "Z", img: Z },
    { letter: "O", img: O },
    { letter: "O2", img: O },
    { letter: "V", img: V },
    { letter: "U", img: U },
  ];
  const [initialArray, setInitialArray] = useState(shuffle(cardArray));
  const [userArray, setUserArray] = useState([]);
  const [movement, setMovement] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [countDown, setCountDown] = useState(10);
  const refDrag = useRef(null);
  const refTarget = useRef(null);

  // // IF THE GAME STARTED AND THE PUZZLE IS NOT CORRECT, COUNT SCORE EVERY SECOND
  useEffect(() => {
    if (!isCorrect && isStarted) {
      const interval = setInterval(() => {
        handleCounter(1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isCorrect, isStarted, handleCounter]);

  // // IF PUZZLE IS CORRECT COUNTDOWN FROM 10 TO 0
  useEffect(() => {
    if (isCorrect && countDown > 0) {
      const interval = setInterval(() => {
        setCountDown((countdown) => countdown - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isCorrect, countDown]);

  // // BACK TO THE INITIAL STATES TO START A NEW GAME WITH SAME USER
  const restartGame = useCallback(() => {
    setInitialArray(shuffle(cardArray));
    setUserArray([]);
    handleCounter(0);
    setIsCorrect(false);
    setIsStarted(false);
    setCountDown(10);
  }, [handleCounter, cardArray]);

  // // WHEN COUNTDOWN IS 0 IT'S TIME TO RESTART TO THE GAME
  useEffect(() => {
    if (countDown === 0) {
      restartGame();
    }
  }, [countDown, restartGame]);

  // // LOGSAW IS CHECKING WHETHER THE PUZZLE IS CORRECT OR NOT. IF THE MOVEMENT IS WRONG HE ADDS 10 MORE SECONDS
  useEffect(() => {
    if (movement) {
      const check = checkMove(movement);
      !check && handleCounter(10);
      setIsCorrect(checkCorrect(userArray));
    }
  }, [userArray, movement, handleCounter]);

  const handleDragStart = (e) => {
    refDrag.current = e.target;
    e.target.classList.add("hold");
    setTimeout(() => {
      e.target.classList.add("invisible");
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.add("card");
    e.target.classList.remove("hold");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    refTarget.current = e.target;
    e.preventDefault();
    e.target.classList.add("hovered");
  };

  const handleDragLeave = (e) => {
    refTarget.current = null;
    e.target.classList.add("empty");
    e.target.classList.remove("hovered");
  };

  const handleDragDrop = (e) => {
    e.target.classList.add("empty");
    e.target.classList.remove("hovered");
    refTarget?.current?.className === "empty" &&
      e.target.append(refDrag.current);
    const i = e.currentTarget.getAttribute("index");
    const letter = refDrag.current.getAttribute("letter");
    const newMove = { index: i, letter: letter };
    i !== null ? setMovement(newMove) : setMovement(null);
    const found = userArray.some((el) => el.letter === letter);
    found && setUserArray(userArray.filter((el) => el.letter !== letter));
    i && setUserArray((prev) => [...prev, newMove]);
  };

  return isCorrect ? (
    <div className="congratulations">
      <span className="congratulationsTitle">Congratulations</span>
      <span className="congratulationsDesc">
        Game restarts in {countDown} seconds
      </span>
    </div>
  ) : (
    <div className="cardContainer">
      <div className="initialCards">
        {initialArray.map((card) => (
          <div
            className="empty"
            key={card.letter}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDragDrop}
          >
            <div
              letter={card.letter}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onMouseDown={() => !isStarted && setIsStarted(true)}
              className="card"
              style={{
                backgroundImage: `url(${card.img})`,
                backgroundPosition: "center",
                backgroundSize: "50% 50%",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className="userCards">
        {initialArray.map((c, i) => (
          <div
            index={i}
            key={i}
            className="empty"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDragDrop}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CardGroup;
