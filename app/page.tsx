'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import GameBoard from '@/components/GameBoard';
import Keyboard from '@/components/Keyboard';
import HelpModal from '@/components/HelpModal';
import StatsModal from '@/components/StatsModal';
import SettingsModal from '@/components/SettingsModal';
import GameModeModal from '@/components/GameModeModal';
import InviteModal from '@/components/InviteModal';
import MultiplayerGame from '@/components/MultiplayerGame';
import { GameState, GameStatus, Statistics, Settings, MultiplayerSession } from '@/types';
import { getTodaysPuzzle, getPuzzleNumber } from '@/lib/puzzle';
import { isMathematicallyValid, getValidationError } from '@/lib/validation';
import {
  saveGameState,
  loadGameState,
  saveStatistics,
  loadStatistics,
  saveSettings,
  loadSettings,
  isFirstTimeUser,
  setFirstTimeUserComplete,
} from '@/lib/storage';
import {
  updateStatistics,
  shouldResetGame,
  getKeyboardFeedback,
  generateShareText,
  validateHardMode,
} from '@/lib/game';
import {
  createMultiplayerSession,
  joinMultiplayerSession,
  generatePlayerId,
} from '@/lib/multiplayerGame';

const MAX_GUESSES = 6;
const MAX_EQUATION_LENGTH = 13;

function HomeContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState('');
  const [puzzleNumber, setPuzzleNumber] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzleNumber: 0,
    guesses: [],
    gameStatus: 'IN_PROGRESS',
    lastPlayed: new Date().toISOString(),
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [statistics, setStatistics] = useState<Statistics>(loadStatistics());
  const [settings, setSettings] = useState<Settings>(loadSettings());
  const [isInvalidGuess, setIsInvalidGuess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multiplayer states
  const [multiplayerSession, setMultiplayerSession] = useState<MultiplayerSession | null>(null);
  const [playerId] = useState<string>(() => generatePlayerId());
  const [showGameMode, setShowGameMode] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  // Modal states
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    setMounted(true);
    const todaysPuzzle = getTodaysPuzzle();
    const todaysPuzzleNumber = getPuzzleNumber(new Date());

    setTarget(todaysPuzzle);
    setPuzzleNumber(todaysPuzzleNumber);

    // Check if joining a multiplayer session
    const sessionId = searchParams.get('session');
    if (sessionId) {
      joinMultiplayerSession(sessionId, playerId).then((result) => {
        if (result?.session) {
          setMultiplayerSession(result.session);
        } else {
          setErrorMessage('Failed to join session');
        }
      });
      return;
    }

    const savedState = loadGameState();

    // Check if there's an existing multiplayer session
    if (savedState?.mode === 'multiplayer' && savedState.sessionId) {
      // TODO: Restore multiplayer session
      setShowGameMode(true);
    } else if (savedState && !shouldResetGame(todaysPuzzleNumber, savedState.currentPuzzleNumber)) {
      setGameState(savedState);
    } else {
      // Show game mode selection for new game
      setShowGameMode(true);
    }

    // Show help modal for first-time users
    if (isFirstTimeUser()) {
      setShowHelp(true);
      setFirstTimeUserComplete();
    }
  }, [searchParams, playerId]);

  // Apply theme
  useEffect(() => {
    if (mounted) {
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme, mounted]);

  // Handle key press from keyboard
  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameState.gameStatus !== 'IN_PROGRESS') return;

      setErrorMessage(null);
      setIsInvalidGuess(false);

      if (key === '⌫') {
        // Backspace
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (key === '✓') {
        // Submit
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

        // Check hard mode constraints
        if (settings.hardMode) {
          const hardModeError = validateHardMode(currentGuess, gameState.guesses, target);
          if (hardModeError) {
            setErrorMessage(hardModeError);
            setIsInvalidGuess(true);
            setTimeout(() => setIsInvalidGuess(false), 500);
            return;
          }
        }

        // Valid guess - add to guesses
        const newGuesses = [...gameState.guesses, currentGuess];
        let newStatus: GameStatus = gameState.gameStatus;

        // Check win condition
        if (currentGuess === target) {
          newStatus = 'WON';
        } else if (newGuesses.length >= MAX_GUESSES) {
          newStatus = 'LOST';
        }

        const newState: GameState = {
          ...gameState,
          guesses: newGuesses,
          gameStatus: newStatus,
          lastPlayed: new Date().toISOString(),
        };

        setGameState(newState);
        saveGameState(newState);
        setCurrentGuess('');

        // Update statistics if game ended
        if (newStatus !== 'IN_PROGRESS') {
          const newStats = updateStatistics(statistics, newState, gameState);
          setStatistics(newStats);
          saveStatistics(newStats);

          // Show stats modal after a delay
          setTimeout(() => setShowStats(true), 2000);
        }
      } else if (key === '=') {
        // Add equals sign with spaces
        if (currentGuess.length < MAX_EQUATION_LENGTH - 4) {
          setCurrentGuess((prev) => prev + ' = ');
        }
      } else {
        // Add character
        if (currentGuess.length < MAX_EQUATION_LENGTH) {
          // Auto-add spaces around operators
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
    [currentGuess, gameState, target, statistics]
  );

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showHelp || showStats || showSettings) return;

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
  }, [handleKeyPress, showHelp, showStats, showSettings]);

  // Handle game mode selection
  const handleSelectSolo = () => {
    setShowGameMode(false);
    const newState: GameState = {
      currentPuzzleNumber: puzzleNumber,
      guesses: [],
      gameStatus: 'IN_PROGRESS',
      lastPlayed: new Date().toISOString(),
      mode: 'solo',
    };
    setGameState(newState);
    saveGameState(newState);
  };

  const handleSelectMultiplayer = async () => {
    setShowGameMode(false);
    const result = await createMultiplayerSession(playerId);
    if (result) {
      setMultiplayerSession(result.session);
      setShowInvite(true);
    } else {
      setErrorMessage('Failed to create multiplayer session');
    }
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Get keyboard feedback
  const keyFeedback = getKeyboardFeedback(gameState.guesses, target);

  // Generate share text if game is over
  const shareText =
    gameState.gameStatus !== 'IN_PROGRESS'
      ? generateShareText(puzzleNumber, gameState.guesses, target, gameState.gameStatus)
      : undefined;

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Header
        onHelpClick={() => setShowHelp(true)}
        onStatsClick={() => setShowStats(true)}
        onSettingsClick={() => setShowSettings(true)}
      />

      <main className="flex-1 flex flex-col items-center justify-between px-1 sm:px-4 py-2 sm:py-4 max-w-full">
        {/* Render multiplayer or solo game */}
        {multiplayerSession ? (
          <MultiplayerGame initialSession={multiplayerSession} playerId={playerId} colorBlindMode={settings.colorBlindMode} />
        ) : (
          <>
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-2 mx-2 px-3 xs:px-4 py-2 bg-error text-white rounded text-xs xs:text-sm font-semibold text-center max-w-full">
                {errorMessage}
              </div>
            )}

            {/* Game Status */}
            {gameState.gameStatus !== 'IN_PROGRESS' && (
              <div className="mb-2 mx-2 px-3 xs:px-4 py-2 bg-primary text-white rounded text-xs xs:text-sm font-semibold text-center max-w-full">
                {gameState.gameStatus === 'WON' ? '🎉 Congratulations!' : `Game Over! Answer: ${target}`}
              </div>
            )}

            <GameBoard
              guesses={gameState.guesses}
              currentGuess={currentGuess}
              target={target}
              maxGuesses={MAX_GUESSES}
              isInvalidGuess={isInvalidGuess}
              colorBlindMode={settings.colorBlindMode}
            />

            <Keyboard
              onKeyPress={handleKeyPress}
              keyFeedback={keyFeedback}
              disabled={gameState.gameStatus !== 'IN_PROGRESS'}
              colorBlindMode={settings.colorBlindMode}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <GameModeModal
        isOpen={showGameMode}
        onClose={() => setShowGameMode(false)}
        onSelectSolo={handleSelectSolo}
        onSelectMultiplayer={handleSelectMultiplayer}
      />
      {multiplayerSession && (
        <InviteModal
          isOpen={showInvite}
          onClose={() => setShowInvite(false)}
          sessionId={multiplayerSession.id}
          onInviteSent={() => setShowInvite(false)}
        />
      )}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} colorBlindMode={settings.colorBlindMode} />
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        statistics={statistics}
        shareText={shareText}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
