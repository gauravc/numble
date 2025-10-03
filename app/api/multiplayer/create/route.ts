import { NextRequest, NextResponse } from 'next/server';
import { createSession, generateSessionId } from '@/lib/multiplayerStorage';
import { getTodaysPuzzle, getPuzzleNumber } from '@/lib/puzzle';
import { MultiplayerSession } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json();

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }

    const sessionId = generateSessionId();
    const puzzleNumber = getPuzzleNumber(new Date());
    const puzzle = getTodaysPuzzle();

    const session: MultiplayerSession = {
      id: sessionId,
      puzzleNumber,
      puzzle,
      createdAt: new Date().toISOString(),
      creatorId: playerId,
      currentTurn: 'creator',
      guesses: [],
      gameStatus: 'IN_PROGRESS',
    };

    await createSession(session);

    return NextResponse.json({ sessionId, session });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
