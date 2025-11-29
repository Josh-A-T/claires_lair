import React from 'react';

const AlphabetNav = ({ activeLetter, onLetterClick }) => {
  const letters = [
    '0-10', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return (
    <div className="alphabet-nav">
      {letters.map((letter, index) => (
        <span key={letter}>
          <a 
            href={`#${letter}`}
            className={`alphabet-nav-link ${activeLetter === letter ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onLetterClick(letter);
              document.getElementById(letter)?.scrollIntoView();
            }}
          >
            {letter === '0-10' ? '0–10' : letter}
          </a>
          {index < letters.length - 1 && ' | '}
        </span>
      ))}
    </div>
  );
};

export default AlphabetNav;