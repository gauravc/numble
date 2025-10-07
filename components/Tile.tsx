'use client';

import { FeedbackColor } from '@/types';
import { useEffect, useState } from 'react';

interface TileProps {
  char: string;
  feedback: FeedbackColor;
  isRevealing?: boolean;
  revealDelay?: number;
  isPop?: boolean;
  colorBlindMode?: boolean;
}

export default function Tile({
  char,
  feedback,
  isRevealing = false,
  revealDelay = 0,
  isPop = false,
  colorBlindMode = false,
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
      return 'bg-tile-default-light';
    }

    switch (feedback) {
      case 'green':
        return colorBlindMode ? 'bg-tile-green-cb' : 'bg-tile-green';
      case 'yellow':
        return colorBlindMode ? 'bg-tile-yellow-cb' : 'bg-tile-yellow';
      case 'gray':
        return 'bg-tile-gray-light';
      default:
        return 'bg-tile-default-light';
    }
  };

  const getBorderClass = () => {
    if (char && feedback === 'default') {
      return 'border-2 border-gray-400';
    }
    if (feedback === 'default') {
      return 'border-2 border-border-light';
    }
    return 'border-0';
  };

  const getTextColor = () => {
    if (feedback === 'default') {
      return 'text-gray-800'; // Dark text for unguessed tiles (visible on white background)
    }
    if (feedback === 'gray') {
      return 'text-white'; // White text for gray (incorrect) tiles
    }
    return 'text-white'; // White text for colored tiles (green/amber)
  };

  return (
    <div
      className={`
        w-5 h-8 xs:w-7 xs:h-10 sm:w-11 sm:h-11 md:w-14 md:h-14
        flex items-center justify-center
        font-bold text-xs xs:text-sm sm:text-lg md:text-2xl
        ${getTextColor()}
        ${getFeedbackClass()}
        ${getBorderClass()}
        rounded sm:rounded-lg
        transition-all duration-100
        ${shouldReveal ? 'animate-flip' : ''}
        ${isPop ? 'animate-pop' : ''}
        shadow-sm
      `}
      style={{
        animationDelay: shouldReveal ? `${revealDelay}ms` : '0ms',
      }}
    >
      {char}
    </div>
  );
}
