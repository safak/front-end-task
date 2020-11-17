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

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import "./cardGroup.css";
// import Card from "./Card";
// import Z from "../assets/zoovu-z.svg";
// import O from "../assets/zoovu-o.svg";
// import V from "../assets/zoovu-v.svg";
// import U from "../assets/zoovu-u.svg";

// const shuffle = (a) => {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// };

// const checkCorrect = (array) => {
//   const CORRECT_ARRAY = ["Z", "O", "V", "U"];
//   return (
//     CORRECT_ARRAY.length === array.length &&
//     CORRECT_ARRAY.every((value, index) => value === array[index].letter)
//   );
// };

// const CardGroup = ({ handleCounter }) => {
//   const data = [
//     {
//       title: "group 1",
//       items: shuffle([
//         { letter: "Z", img: Z },
//         { letter: "O", img: O },
//         { letter: "V", img: V },
//         { letter: "U", img: U },
//       ]),
//     },
//     { title: "group 2", items: [] },
//   ];
//   const [isStarted, setIsStarted] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [countDown, setCountDown] = useState(10);
//   const [list, setList] = useState(data);
//   const [dragging, setDragging] = useState(false);
//   const dragItemRef = useRef();
//   const dragNodeRef = useRef();

//   //IF THE GAME STARTED AND THE PUZZLE IS NOT CORRECT, COUNT SCORE EVERY SECOND
//   useEffect(() => {
//     const interval = setInterval(() => {
//       !isCorrect && isStarted && handleCounter((counter) => counter + 1);
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [isCorrect, isStarted, handleCounter]);

//   //IF PUZZLE IS CORRECT COUNTDOWN FROM 10 TO 0
//   useEffect(() => {
//     const interval = setInterval(() => {
//       isCorrect && countDown > 0 && setCountDown((countdown) => countdown - 1);
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [isCorrect, countDown]);

//   //BACK TO THE INITIAL STATES TO START A NEW GAME WITH SAME USER
//   const restartGame = useCallback(() => {
//     setList(data);
//     handleCounter(0);
//     setIsCorrect(false);
//     setIsStarted(false);
//     setCountDown(10);
//   },[data,handleCounter]);

//   //WHEN COUNTDOWN IS 0 IT'S TIME TO RESTART TO THE GAME
//   useEffect(() => {
//     if (countDown === 0) {
//       restartGame();
//     }
//   }, [countDown, restartGame]);

//   //LOGSAW IS CHECKING WHETHER THE PUZZLE IS CORRECT OR NOT
//   useEffect(() => {
//     setIsCorrect(checkCorrect(list[1].items));
//   }, [list]);

//   const handleDragStart = (e, params) => {
//     setIsStarted(true);
//     dragItemRef.current = params;
//     dragNodeRef.current = e.target;
//     dragNodeRef.current.addEventListener("dragend", handleDragEnd);
//     setTimeout(() => {
//       setDragging(true);
//     }, 0);
//   };

//   const handleDragEnter = (e, params) => {
//     const currentItem = dragItemRef.current;
//     if (e.target !== dragNodeRef.current) {
//       setList((oldList) => {
//         let newList = JSON.parse(JSON.stringify(oldList));
//         newList[params.groupIndex].items.splice(
//           params.itemIndex,
//           0,
//           newList[currentItem.groupIndex].items.splice(
//             currentItem.itemIndex,
//             1
//           )[0]
//         );
//         dragItemRef.current = params;
//         return newList;
//       });
//     }
//   };

//   const handleDragEnd = () => {
//     setDragging(false);
//     dragNodeRef.current.removeEventListener("dragend", handleDragEnd);
//     dragItemRef.current = null;
//     dragNodeRef.current = null;
//   };

//   const getStyles = (params) => {
//     const currentItem = dragItemRef.current;
//     if (
//       currentItem.groupIndex === params.groupIndex &&
//       currentItem.itemIndex === params.itemIndex
//     ) {
//       return "current";
//     }
//     return "item";
//   };

//   return isCorrect ? (
//     <div className="congratulations">
//       <span className="congratulationsTitle">Congratulations</span>
//       <span className="congratulationsDesc">
//         Game restarts in {countDown} seconds
//       </span>
//     </div>
//   ) : (
//     <div>
//       {list.map((group, groupIndex) => (
//         <div
//           key={group.title}
//           className="cont"
//           onDragEnter={
//             dragging && !group.items.length
//               ? (e) => handleDragEnter(e, { groupIndex, itemIndex: 0 })
//               : null
//           }
//         >
//           {group.items.map((item, itemIndex) => (
//             <div
//               draggable
//               onDragStart={(e) => {
//                 handleDragStart(e, { groupIndex, itemIndex });
//               }}
//               onDragEnter={
//                 dragging
//                   ? (e) => {
//                       handleDragEnter(e, { groupIndex, itemIndex });
//                     }
//                   : null
//               }
//               key={item.letter}
//               className={
//                 dragging ? getStyles({ groupIndex, itemIndex }) : "item"
//               }
//             >
//               <Card img={item.img} />
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CardGroup;

// import React, { useRef, useState } from "react";
// import "./cardGroup.css";
// import Card from "./Card";
// import { ReactComponent as Z } from "../assets/zoovu-z.svg";
// import { ReactComponent as O } from "../assets/zoovu-o.svg";
// import { ReactComponent as V } from "../assets/zoovu-v.svg";
// import { ReactComponent as U } from "../assets/zoovu-u.svg";

// const shuffle = (a) => {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// };

// const isCorrect = (array1, array2) => {
//   return (
//     array1.length === array2.length &&
//     array1.every((value, index) => value === array2[index])
//   );
// };

// const CORRECT_ARRAY = ["Z","O","V","U"]

// const CardGroup = () => {
//   const data = [
//     { title: "group 1", items: ["1", "2", "3"] },
//     { title: "group 2", items: [] },
//   ];
//   const [list, setList] = useState(data);
//   const [dragging, setDragging] = useState(false);
//   const dragItemRef = useRef();
//   const dragNodeRef = useRef();

//   const handleDragStart = (e, params) => {
//     dragItemRef.current = params;
//     dragNodeRef.current = e.target;
//     dragNodeRef.current.addEventListener("dragend", handleDragEnd);
//     setTimeout(() => {
//       setDragging(true);
//     }, 0);
//   };

//   const handleDragEnter = (e, params) => {
//     const currentItem = dragItemRef.current;
//     if (e.target !== dragNodeRef.current) {
//       setList((oldList) => {
//         let newList = JSON.parse(JSON.stringify(oldList));
//         newList[params.groupIndex].items.splice(
//           params.itemIndex,
//           0,
//           newList[currentItem.groupIndex].items.splice(
//             currentItem.itemIndex,
//             1
//           )[0]
//         );
//         dragItemRef.current = params;
//         return newList;
//       });
//     }
//   };

//   const handleDragEnd = () => {
//     setDragging(false);
//     dragNodeRef.current.removeEventListener("dragend", handleDragEnd);
//     dragItemRef.current = null;
//     dragNodeRef.current = null;
//   };

//   const getStyles = (params) => {
//     const currentItem = dragItemRef.current;
//     if (
//       currentItem.groupIndex === params.groupIndex &&
//       currentItem.itemIndex === params.itemIndex
//     ) {
//       return "current";
//     }
//     return "item";
//   };

//   return (
//     <div>
//       {list.map((group, groupIndex) => (
//         <div
//           key={group.title}
//           className="cont"
//           onDragEnter={
//             dragging && !group.items.length
//               ? (e) => handleDragEnter(e, { groupIndex, itemIndex: 0 })
//               : null
//           }
//         >
//           <div className="title">{group.title}</div>
//           {group.items.map((item, itemIndex) => (
//             <div
//               draggable
//               onDragStart={(e) => {
//                 handleDragStart(e, { groupIndex, itemIndex });
//               }}
//               onDragEnter={
//                 dragging
//                   ? (e) => {
//                       handleDragEnter(e, { groupIndex, itemIndex });
//                     }
//                   : null
//               }
//               key={item}
//               className={
//                 dragging ? getStyles({ groupIndex, itemIndex }) : "item"
//               }
//             >
//               {item}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CardGroup;

// import React, { useState } from "react";
// import "./cardGroup.css";
// import Card from "./Card";
// import { ReactComponent as Z } from "../assets/zoovu-z.svg";
// import { ReactComponent as O } from "../assets/zoovu-o.svg";
// import { ReactComponent as V } from "../assets/zoovu-v.svg";
// import { ReactComponent as U } from "../assets/zoovu-u.svg";

// const shuffle = (a) => {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// };

// const CardGroup = () => {
//   const shuffledArray = shuffle([
//     { Component: Z, letter: "Z", status: "pending" },
//     { Component: O, letter: "O", status: "pending" },
//     { Component: O, letter: "O2", status: "pending" },
//     { Component: V, letter: "V", status: "pending" },
//     { Component: U, letter: "U", status: "pending" },
//   ]);

//   const [cardArray, setCardArray] = useState(shuffledArray);

//   let obj = {
//     pending: [],
//     completed: [],
//   };

//   const handleDragStart = (e, letter) => {
//     e.dataTransfer.setData("id", letter);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleOnDrop = (e, status, i) => {
//     let id = e.dataTransfer.getData("id");
//     let list = cardArray.filter((card) => {
//       if (card.letter === id) {
//         card.status = status;
//       }
//       return card;
//     });
//     setCardArray(list);
//   };

//   cardArray.forEach((card) => {
//     const { Component, letter, status } = card;
//     obj[status].push(
//       <div
//         onDragStart={(e) => handleDragStart(e, letter)}
//         key={letter}
//         draggable
//         className="card"
//       >
//         <Component className="letter" />
//       </div>
//     );
//   });

//   return (
//     <>
//       <div className="cardGroup" onDragOver={(e) => handleDragOver(e)}>
//         {/* {cardArray.map((card) => (
//           <Card Letter={card} />
//         ))} */}
//         {obj.pending}
//       </div>
//       <div className="cardGroup">
//         {cardArray.map((c, i) => (
//           <div
//             className="cardGroupDragArea"
//             key={i}
//             onDragOver={(e) => handleDragOver(e)}
//             onDrop={(e, i) => handleOnDrop(e, "completed", i)}
//           >
//             {i === 2 && obj.completed[i]}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default CardGroup;
