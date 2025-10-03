'use client';

import { FeedbackColor } from '@/types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyFeedback: Map<string, FeedbackColor>;
  disabled: boolean;
}

export default function Keyboard({ onKeyPress, keyFeedback, disabled }: KeyboardProps) {
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
      return 'bg-gray-400 cursor-not-allowed';
    }

    const feedback = keyFeedback.get(key);

    switch (feedback) {
      case 'green':
        return 'bg-tile-green text-text-dark';
      case 'yellow':
        return 'bg-tile-yellow text-text-dark';
      case 'gray':
        return 'bg-tile-gray-light dark:bg-tile-gray-dark text-text-dark';
      default:
        return 'bg-keyboard text-text-dark hover:bg-opacity-80';
    }
  };

  const handleClick = (key: string) => {
    if (disabled) return;
    onKeyPress(key);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 pb-4">
      {/* Numbers - Calculator Style */}
      <div className="mb-2">
        {numbers.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            {row.map((num) => (
              <button
                key={num}
                onClick={() => handleClick(num)}
                disabled={disabled}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14
                  rounded font-bold text-lg
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
      <div className="flex justify-center gap-1 sm:gap-2 mb-2">
        {operators.map((op) => (
          <button
            key={op}
            onClick={() => handleClick(op)}
            disabled={disabled}
            className={`
              w-12 h-12 sm:w-14 sm:h-14
              rounded font-bold text-xl
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
      <div className="flex justify-center gap-1 sm:gap-2">
        {special.map((key) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            disabled={disabled}
            className={`
              ${key === '⌫' ? 'w-16 sm:w-20' : 'w-12 sm:w-14'}
              h-12 sm:h-14
              rounded font-bold text-lg
              transition-all duration-150
              ${getKeyClass(key)}
              active:scale-95
              ${key === '✓' ? 'bg-primary text-text-dark hover:bg-opacity-90' : ''}
            `}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
