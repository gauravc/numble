'use client';

import { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import { MultiplayerSession, FeedbackColor } from '@/types';
import { isMathematicallyValid, getValidationError } from '@/lib/validation';
import { getKeyboardFeedback } from '@/lib/game';
import {
  submitMultiplayerGuess,
  fetchMultiplayerSession,
  isPlayerTurn,
  getPlayerGuesses,
  generatePlayerId,
} from '@/lib/multiplayerGame';

const MAX_EQUATION_LENGTH = 13;
const POLL_INTERVAL = 3000; // Poll every 3 seconds

interface MultiplayerGameProps {
  initialSession: MultiplayerSession;
  playerId: string;
}

export default function MultiplayerGame({ initialSession, playerId }: MultiplayerGameProps) {
  const [session, setSession] = useState<MultiplayerSession>(initialSession);
  const [currentGuess, setCurrentGuess] = useState('');
  const [isInvalidGuess, setIsInvalidGuess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Poll for session updates
  useEffect(() => {
    const pollSession = async () => {
      const result = await fetchMultiplayerSession(session.id);
      if (result?.session) {
        setSession(result.session);
      }
    };

    const interval = setInterval(pollSession, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [session.id]);

  const handleKeyPress = useCallback(
    async (key: string) => {
      if (session.gameStatus !== 'IN_PROGRESS') return;

      if (!isPlayerTurn(session, playerId)) {
        setErrorMessage('Wait for your turn!');
        setTimeout(() => setErrorMessage(null), 2000);
        return;
      }

      setErrorMessage(null);
      setIsInvalidGuess(false);

      if (key === '⌫') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === '✓') {
        if (currentGuess.length === 0) return;

        const error = getValidationError(currentGuess);
        if (error) {
          setErrorMessage(error);
          setIsInvalidGuess(true);
          setTimeout(() => setIsInvalidGuess(false), 500);
          return;
        }

        if (!isMathematicallyValid(currentGuess)) {
          setErrorMessage('Equation is not correct');
          setIsInvalidGuess(true);
          setTimeout(() => setIsInvalidGuess(false), 500);
          return;
        }

        // Submit guess to server
        const result = await submitMultiplayerGuess(session.id, playerId, currentGuess);
        if (result?.session) {
          setSession(result.session);
          setCurrentGuess('');
        } else {
          setErrorMessage('Failed to submit guess');
        }
      } else if (key === '=') {
        if (currentGuess.length < MAX_EQUATION_LENGTH - 4) {
          setCurrentGuess((prev) => prev + ' = ');
        }
      } else {
        if (currentGuess.length < MAX_EQUATION_LENGTH) {
          if (['+', '-', '*', '/'].includes(key)) {
            const lastChar = currentGuess[currentGuess.length - 1];
            const prefix = lastChar === ' ' ? '' : ' ';
            setCurrentGuess((prev) => prev + prefix + key + ' ');
          } else {
            setCurrentGuess((prev) => prev + key);
          }
        }
      }
    },
    [currentGuess, session, playerId]
  );

  // Physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleKeyPress('⌫');
      } else if (e.key === 'Enter') {
        handleKeyPress('✓');
      } else if (/^[0-9+\-*/=]$/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const playerGuesses = getPlayerGuesses(session, playerId);
  const allGuesses = session.guesses.map(g => g.guess);
  const keyFeedback = getKeyboardFeedback(allGuesses, session.puzzle);

  const isMyTurn = isPlayerTurn(session, playerId);
  const waitingForOpponent = !session.opponentId;

  return (
    <div className="space-y-4">
      {/* Status Messages */}
      {errorMessage && (
        <div className="px-4 py-2 bg-error text-white rounded text-sm font-semibold text-center">
          {errorMessage}
        </div>
      )}

      {waitingForOpponent && (
        <div className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold text-center">
          ⏳ Waiting for opponent to join...
        </div>
      )}

      {!waitingForOpponent && session.gameStatus === 'IN_PROGRESS' && (
        <div className={`px-4 py-2 rounded text-sm font-semibold text-center ${
          isMyTurn ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
        }`}>
          {isMyTurn ? '🎯 Your turn!' : '⏳ Opponent\'s turn...'}
        </div>
      )}

      {session.gameStatus === 'WON' && (
        <div className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold text-center">
          {session.winnerId === playerId ? '🎉 You won!' : '😔 Opponent won! Answer: ' + session.puzzle}
        </div>
      )}

      {session.gameStatus === 'LOST' && (
        <div className="px-4 py-2 bg-error text-white rounded text-sm font-semibold text-center">
          Game Over! Answer: {session.puzzle}
        </div>
      )}

      {/* Game Board */}
      <GameBoard
        guesses={playerGuesses}
        currentGuess={isMyTurn ? currentGuess : ''}
        target={session.puzzle}
        maxGuesses={6}
        isInvalidGuess={isInvalidGuess}
      />

      {/* Opponent's Progress */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Opponent: {session.guesses.filter(g => g.playerId !== playerId).length} guesses
      </div>

      {/* Keyboard */}
      <Keyboard
        onKeyPress={handleKeyPress}
        keyFeedback={keyFeedback}
        disabled={session.gameStatus !== 'IN_PROGRESS' || !isMyTurn || waitingForOpponent}
      />
    </div>
  );
}
