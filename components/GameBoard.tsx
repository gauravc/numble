'use client';

import { FeedbackColor } from '@/types';
import Tile from './Tile';
import { generateFeedback } from '@/lib/validation';
import { useState, useEffect } from 'react';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  target: string;
  maxGuesses: number;
  isInvalidGuess: boolean;
}

const MAX_EQUATION_LENGTH = 13; // "99 + 99 = 999"

export default function GameBoard({
  guesses,
  currentGuess,
  target,
  maxGuesses,
  isInvalidGuess,
}: GameBoardProps) {
  const [revealingRow, setRevealingRow] = useState<number | null>(null);

  // Trigger reveal animation when a new guess is submitted
  useEffect(() => {
    if (guesses.length > 0) {
      setRevealingRow(guesses.length - 1);
      const timer = setTimeout(() => {
        setRevealingRow(null);
      }, MAX_EQUATION_LENGTH * 100 + 500);
      return () => clearTimeout(timer);
    }
  }, [guesses.length]);

  const renderRow = (rowIndex: number) => {
    const isCurrentRow = rowIndex === guesses.length;
    const isCompletedRow = rowIndex < guesses.length;
    const isRevealing = revealingRow === rowIndex;

    let rowContent: string;
    let feedback: FeedbackColor[] = [];

    if (isCompletedRow) {
      rowContent = guesses[rowIndex];
      feedback = generateFeedback(rowContent, target);
    } else if (isCurrentRow) {
      rowContent = currentGuess;
      feedback = Array(MAX_EQUATION_LENGTH).fill('default');
    } else {
      rowContent = '';
      feedback = Array(MAX_EQUATION_LENGTH).fill('default');
    }

    // Pad the row to max length
    const paddedRow = rowContent.padEnd(MAX_EQUATION_LENGTH, ' ');
    const tiles = paddedRow.split('');

    return (
      <div
        key={rowIndex}
        className={`
          flex gap-1 sm:gap-2 justify-center mb-2
          ${isInvalidGuess && isCurrentRow ? 'animate-shake' : ''}
        `}
      >
        {tiles.map((char, charIndex) => (
          <Tile
            key={charIndex}
            char={char === ' ' ? '' : char}
            feedback={feedback[charIndex] || 'default'}
            isRevealing={isRevealing}
            revealDelay={charIndex * 100}
            isPop={isCurrentRow && charIndex === currentGuess.length - 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {Array.from({ length: maxGuesses }, (_, i) => renderRow(i))}
    </div>
  );
}
