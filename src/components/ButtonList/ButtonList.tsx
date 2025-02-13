import React from 'react';
import './ButtonList.css';
import ButtonListOptions from '../../interface/ButtonListOptions';

const ButtonList = ({ options, handleChoice, selected }: ButtonListOptions) => {
  return (
    <div className={'button-list'}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleChoice(option)}
          disabled={!!selected}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ButtonList;
