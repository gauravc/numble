'use client';

import { FeedbackColor } from '@/types';
import { useEffect, useState } from 'react';

interface TileProps {
  char: string;
  feedback: FeedbackColor;
  isRevealing?: boolean;
  revealDelay?: number;
  isPop?: boolean;
}

export default function Tile({
  char,
  feedback,
  isRevealing = false,
  revealDelay = 0,
  isPop = false,
}: TileProps) {
  const [shouldReveal, setShouldReveal] = useState(false);

  useEffect(() => {
    if (isRevealing) {
      const timer = setTimeout(() => {
        setShouldReveal(true);
      }, revealDelay);
      return () => clearTimeout(timer);
    }
    // Don't reset shouldReveal to false - keep the revealed state
  }, [isRevealing, revealDelay]);

  const getFeedbackClass = () => {
    // For completed rows (not currently revealing), show feedback immediately
    // For revealing rows, wait until shouldReveal is true
    const showFeedback = !isRevealing || shouldReveal;

    if (!showFeedback && feedback !== 'default') {
      return 'bg-tile-default-light dark:bg-tile-default-dark';
    }

    switch (feedback) {
      case 'green':
        return 'bg-tile-green';
      case 'yellow':
        return 'bg-tile-yellow';
      case 'gray':
        return 'bg-tile-gray-light dark:bg-tile-gray-dark';
      default:
        return 'bg-tile-default-light dark:bg-tile-default-dark';
    }
  };

  const getBorderClass = () => {
    if (char && feedback === 'default') {
      return 'border-2 border-text-light dark:border-text-dark';
    }
    return 'border-2 border-border-light dark:border-border-dark';
  };

  return (
    <div
      className={`
        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
        flex items-center justify-center
        font-bold text-lg sm:text-xl md:text-2xl
        text-text-dark
        ${getFeedbackClass()}
        ${getBorderClass()}
        rounded
        transition-all duration-100
        ${shouldReveal ? 'animate-flip' : ''}
        ${isPop ? 'animate-pop' : ''}
      `}
      style={{
        animationDelay: shouldReveal ? `${revealDelay}ms` : '0ms',
      }}
    >
      {char}
    </div>
  );
}
