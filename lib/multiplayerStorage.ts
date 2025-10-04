import { createClient } from 'redis';
import { MultiplayerSession, MultiplayerGuess } from '@/types';

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 60 * 60 * 24; // 24 hours in seconds

let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.kv_store_REDIS_URL
    });
    await redis.connect();
  }
  return redis;
}

export async function createSession(session: MultiplayerSession): Promise<void> {
  const client = await getRedisClient();
  await client.set(`${SESSION_PREFIX}${session.id}`, JSON.stringify(session), { EX: SESSION_TTL });
}

export async function getSession(sessionId: string): Promise<MultiplayerSession | null> {
  const client = await getRedisClient();
  const data = await client.get(`${SESSION_PREFIX}${sessionId}`);
  if (!data) return null;
  return JSON.parse(data);
}

export async function updateSession(
  sessionId: string,
  updates: Partial<MultiplayerSession>
): Promise<MultiplayerSession | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  const updatedSession = { ...session, ...updates };
  const client = await getRedisClient();
  await client.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(updatedSession), { EX: SESSION_TTL });
  return updatedSession;
}

export async function addGuessToSession(
  sessionId: string,
  guess: MultiplayerGuess
): Promise<MultiplayerSession | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  const updatedSession = {
    ...session,
    guesses: [...session.guesses, guess],
  };
  const client = await getRedisClient();
  await client.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(updatedSession), { EX: SESSION_TTL });
  return updatedSession;
}

export async function joinSession(
  sessionId: string,
  opponentId: string
): Promise<MultiplayerSession | null> {
  const session = await getSession(sessionId);
  if (!session || session.opponentId) return null; // Already has opponent

  const updatedSession = {
    ...session,
    opponentId,
  };
  const client = await getRedisClient();
  await client.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(updatedSession), { EX: SESSION_TTL });
  return updatedSession;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
