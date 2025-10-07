import { createClient } from 'redis';
import { MultiplayerSession, MultiplayerGuess } from '@/types';

const SESSION_PREFIX = 'session:';

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

// Calculate seconds until midnight Pacific Time
function getSecondsUntilMidnightPT(): number {
  const now = new Date();

  // Create a date object for midnight Pacific Time
  const midnightPT = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  midnightPT.setHours(24, 0, 0, 0); // Next midnight

  // Convert back to UTC for comparison
  const nowUTC = now.getTime();
  const midnightPTUTC = new Date(midnightPT.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();

  const diff = midnightPTUTC - nowUTC;
  return Math.max(Math.floor(diff / 1000), 60); // At least 60 seconds
}

export async function createSession(session: MultiplayerSession): Promise<void> {
  const client = await getRedisClient();
  const ttl = getSecondsUntilMidnightPT();
  await client.set(`${SESSION_PREFIX}${session.id}`, JSON.stringify(session), { EX: ttl });
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
  const ttl = getSecondsUntilMidnightPT();
  await client.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(updatedSession), { EX: ttl });
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
  const ttl = getSecondsUntilMidnightPT();
  await client.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(updatedSession), { EX: ttl });
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
  const ttl = getSecondsUntilMidnightPT();
  await client.set(`${SESSION_PREFIX}${sessionId}`, JSON.stringify(updatedSession), { EX: ttl });
  return updatedSession;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
