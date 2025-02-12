import React from 'react';
import './ButtonList.css';

interface ButtonListOptions {
  options: string[];
  handleChoice: (e: string) => void;
  selected: string | null;
}

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
