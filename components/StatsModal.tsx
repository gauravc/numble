'use client';

import Modal from './Modal';
import { Statistics } from '@/types';
import { calculateWinPercentage } from '@/lib/utils';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: Statistics;
  shareText?: string;
}

export default function StatsModal({ isOpen, onClose, statistics, shareText }: StatsModalProps) {
  const [copied, setCopied] = useState(false);

  const winPercentage = calculateWinPercentage(statistics.gamesWon, statistics.gamesPlayed);

  const maxGuesses = Math.max(...Object.values(statistics.guessDistribution));

  const handleShare = async () => {
    if (shareText) {
      const success = await copyToClipboard(shareText);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-3xl font-bold">{statistics.gamesPlayed}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Played</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{winPercentage}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Win %</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{statistics.currentStreak}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Current Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{statistics.maxStreak}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Max Streak</div>
          </div>
        </div>

        {/* Guess Distribution */}
        <div>
          <h3 className="font-semibold mb-3">Guess Distribution</h3>
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const count = statistics.guessDistribution[num as 1 | 2 | 3 | 4 | 5 | 6];
              const percentage = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0;

              return (
                <div key={num} className="flex items-center gap-2">
                  <div className="w-4 text-sm">{num}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                    <div
                      className="bg-primary h-6 flex items-center justify-end pr-2 text-xs text-text-dark font-semibold transition-all"
                      style={{ width: `${Math.max(percentage, count > 0 ? 10 : 0)}%` }}
                    >
                      {count > 0 && count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Share Button */}
        {shareText && (
          <button
            onClick={handleShare}
            className="w-full py-3 bg-primary text-text-dark font-semibold rounded hover:opacity-90 transition-opacity"
          >
            {copied ? 'Copied to Clipboard!' : 'Share Results'}
          </button>
        )}
      </div>
    </Modal>
  );
}
