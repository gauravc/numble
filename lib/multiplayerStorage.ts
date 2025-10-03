import { MultiplayerSession, MultiplayerGuess } from '@/types';

// Simple in-memory storage for development
// In production, this would be replaced with a real database like Vercel KV or MongoDB
let sessions: Map<string, MultiplayerSession> = new Map();

export function createSession(session: MultiplayerSession): void {
  sessions.set(session.id, session);
}

export function getSession(sessionId: string): MultiplayerSession | null {
  return sessions.get(sessionId) || null;
}

export function updateSession(sessionId: string, updates: Partial<MultiplayerSession>): MultiplayerSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const updatedSession = { ...session, ...updates };
  sessions.set(sessionId, updatedSession);
  return updatedSession;
}

export function addGuessToSession(sessionId: string, guess: MultiplayerGuess): MultiplayerSession | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const updatedSession = {
    ...session,
    guesses: [...session.guesses, guess],
  };
  sessions.set(sessionId, updatedSession);
  return updatedSession;
}

export function joinSession(sessionId: string, opponentId: string): MultiplayerSession | null {
  const session = sessions.get(sessionId);
  if (!session || session.opponentId) return null; // Already has opponent

  const updatedSession = {
    ...session,
    opponentId,
  };
  sessions.set(sessionId, updatedSession);
  return updatedSession;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
