import React from 'react';

type CardProps = {
  title: string;
  imgSrc: string;
  onClick: () => void;
};

const Card: React.FC<CardProps> = ({ title, imgSrc, onClick }) => (
  <div className="card" onClick={onClick}>
    <img src={imgSrc} alt={title} />
    <h2>{title}</h2>
  </div>
);

export default Card;