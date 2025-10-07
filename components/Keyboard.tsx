'use client';

import { FeedbackColor } from '@/types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyFeedback: Map<string, FeedbackColor>;
  disabled: boolean;
  colorBlindMode?: boolean;
}

export default function Keyboard({ onKeyPress, keyFeedback, disabled, colorBlindMode = false }: KeyboardProps) {
  const numbers = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0'],
  ];

  const operators = ['+', '-', '*', '/'];
  const special = ['⌫', '=', '✓'];

  const getKeyClass = (key: string) => {
    if (disabled) {
      const feedback = keyFeedback.get(key);
      // Show color scheme even when disabled, but with disabled styling
      switch (feedback) {
        case 'green':
          return colorBlindMode ? 'bg-tile-green-cb text-white opacity-60 cursor-not-allowed' : 'bg-tile-green text-white opacity-60 cursor-not-allowed';
        case 'yellow':
          return colorBlindMode ? 'bg-tile-yellow-cb text-white opacity-60 cursor-not-allowed' : 'bg-tile-yellow text-white opacity-60 cursor-not-allowed';
        case 'gray':
          return 'bg-tile-gray-light text-white opacity-60 cursor-not-allowed';
        default:
          return 'bg-keyboard-disabled cursor-not-allowed text-white';
      }
    }

    const feedback = keyFeedback.get(key);

    switch (feedback) {
      case 'green':
        return colorBlindMode ? 'bg-tile-green-cb text-white' : 'bg-tile-green text-white';
      case 'yellow':
        return colorBlindMode ? 'bg-tile-yellow-cb text-white' : 'bg-tile-yellow text-white';
      case 'gray':
        return 'bg-tile-gray-light text-white';
      default:
        return 'bg-keyboard text-white hover:bg-opacity-80';
    }
  };

  const handleClick = (key: string) => {
    if (disabled) return;
    onKeyPress(key);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-1 sm:px-2 pb-2 sm:pb-4">
      {/* Numbers - Calculator Style */}
      <div className="mb-1 sm:mb-2">
        {numbers.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 mb-1">
            {row.map((num) => (
              <button
                key={num}
                onClick={() => handleClick(num)}
                disabled={disabled}
                className={`
                  w-10 h-10 sm:w-14 sm:h-14
                  rounded font-bold text-base sm:text-lg
                  transition-all duration-150
                  ${getKeyClass(num)}
                  active:scale-95
                `}
              >
                {num}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Operators */}
      <div className="flex justify-center gap-1 mb-1 sm:mb-2">
        {operators.map((op) => (
          <button
            key={op}
            onClick={() => handleClick(op)}
            disabled={disabled}
            className={`
              w-10 h-10 sm:w-14 sm:h-14
              rounded font-bold text-lg sm:text-xl
              transition-all duration-150
              ${getKeyClass(op)}
              active:scale-95
            `}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Special Keys */}
      <div className="flex justify-center gap-1">
        {special.map((key) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            disabled={disabled}
            className={`
              ${key === '⌫' ? 'w-14 sm:w-20' : 'w-10 sm:w-14'}
              h-10 sm:h-14
              rounded font-bold text-base sm:text-lg
              transition-all duration-150
              ${getKeyClass(key)}
              active:scale-95
              ${key === '✓' ? 'bg-primary text-white hover:bg-opacity-90' : ''}
            `}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
