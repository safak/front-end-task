import React from "react";
import "./card.css";

const Card = ({ img }) => {
  return (
    <div className="card">
      <img src={img} className="letter" alt="" />
    </div>
  );
};

export default Card;
