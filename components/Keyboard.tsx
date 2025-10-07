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
          return colorBlindMode ? 'bg-tile-green-cb text-white opacity-50 cursor-not-allowed' : 'bg-tile-green text-white opacity-50 cursor-not-allowed';
        case 'yellow':
          return colorBlindMode ? 'bg-tile-yellow-cb text-white opacity-50 cursor-not-allowed' : 'bg-tile-yellow text-white opacity-50 cursor-not-allowed';
        case 'gray':
          return 'bg-tile-gray-light text-white opacity-50 cursor-not-allowed';
        default:
          return 'bg-keyboard-disabled cursor-not-allowed text-gray-600';
      }
    }

    const feedback = keyFeedback.get(key);

    switch (feedback) {
      case 'green':
        return colorBlindMode ? 'bg-tile-green-cb text-white hover:opacity-90' : 'bg-tile-green text-white hover:opacity-90';
      case 'yellow':
        return colorBlindMode ? 'bg-tile-yellow-cb text-white hover:opacity-90' : 'bg-tile-yellow text-white hover:opacity-90';
      case 'gray':
        return 'bg-tile-gray-light text-white hover:opacity-90';
      default:
        return 'bg-keyboard text-gray-700 hover:bg-gray-300 font-semibold';
    }
  };

  const handleClick = (key: string) => {
    if (disabled) return;
    onKeyPress(key);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-1 sm:px-2 pb-2 sm:pb-4">
      {/* Numbers - Calculator Style */}
      <div className="mb-0.5 sm:mb-2">
        {numbers.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            {row.map((num) => (
              <button
                key={num}
                onClick={() => handleClick(num)}
                disabled={disabled}
                className={`
                  w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14
                  rounded sm:rounded-lg font-bold text-sm xs:text-base sm:text-lg
                  transition-all duration-150
                  ${getKeyClass(num)}
                  active:scale-95
                  shadow-sm
                `}
              >
                {num}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Operators */}
      <div className="flex justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-2">
        {operators.map((op) => (
          <button
            key={op}
            onClick={() => handleClick(op)}
            disabled={disabled}
            className={`
              w-8 h-8 xs:w-10 xs:h-10 sm:w-14 sm:h-14
              rounded sm:rounded-lg font-bold text-base xs:text-lg sm:text-xl
              transition-all duration-150
              ${getKeyClass(op)}
              active:scale-95
              shadow-sm
            `}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Special Keys */}
      <div className="flex justify-center gap-0.5 sm:gap-1">
        {special.map((key) => (
          <button
            key={key}
            onClick={() => handleClick(key)}
            disabled={disabled}
            className={`
              ${key === '⌫' ? 'w-12 xs:w-14 sm:w-20' : 'w-8 xs:w-10 sm:w-14'}
              h-8 xs:h-10 sm:h-14
              rounded sm:rounded-lg font-bold text-sm xs:text-base sm:text-lg
              transition-all duration-150
              ${getKeyClass(key)}
              active:scale-95
              shadow-sm
              ${key === '✓' ? 'bg-primary text-white hover:opacity-90' : ''}
            `}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
