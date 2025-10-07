import { MultiplayerSession } from '@/types';

export async function createMultiplayerSession(playerId: string): Promise<{ sessionId: string; session: MultiplayerSession } | null> {
  try {
    const response = await fetch('/api/multiplayer/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error creating multiplayer session:', error);
    return null;
  }
}

export async function joinMultiplayerSession(sessionId: string, playerId: string): Promise<{ session: MultiplayerSession } | null> {
  try {
    const response = await fetch('/api/multiplayer/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, playerId }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error joining multiplayer session:', error);
    return null;
  }
}

export async function submitMultiplayerGuess(
  sessionId: string,
  playerId: string,
  guess: string
): Promise<{ session: MultiplayerSession } | null> {
  try {
    const response = await fetch('/api/multiplayer/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, playerId, guess }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error submitting guess:', error);
    return null;
  }
}

export async function fetchMultiplayerSession(sessionId: string): Promise<{ session: MultiplayerSession } | null> {
  try {
    const response = await fetch(`/api/multiplayer/session/${sessionId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

export function getPlayerRole(session: MultiplayerSession, playerId: string): 'creator' | 'opponent' | null {
  if (session.creatorId === playerId) return 'creator';
  if (session.opponentId === playerId) return 'opponent';
  return null;
}

export function isPlayerTurn(session: MultiplayerSession, playerId: string): boolean {
  const role = getPlayerRole(session, playerId);
  if (!role) return false;
  return session.currentTurn === role;
}

export function getPlayerGuesses(session: MultiplayerSession, playerId: string): string[] {
  return session.guesses
    .filter(g => g.playerId === playerId)
    .map(g => g.guess);
}

export function generatePlayerId(): string {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  const stored = localStorage.getItem('numble_player_id');
  if (stored) return stored;

  const newId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  localStorage.setItem('numble_player_id', newId);
  return newId;
}
