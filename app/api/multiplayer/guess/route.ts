import { NextRequest, NextResponse } from 'next/server';
import { getSession, addGuessToSession, updateSession } from '@/lib/multiplayerStorage';
import { MultiplayerGuess } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerId, guess } = await request.json();

    if (!sessionId || !playerId || !guess) {
      return NextResponse.json({ error: 'Session ID, Player ID, and guess are required' }, { status: 400 });
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify it's the player's turn
    const isCreator = session.creatorId === playerId;
    const isOpponent = session.opponentId === playerId;

    if (!isCreator && !isOpponent) {
      return NextResponse.json({ error: 'Player not in this session' }, { status: 403 });
    }

    const expectedTurn = isCreator ? 'creator' : 'opponent';
    if (session.currentTurn !== expectedTurn) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    if (session.gameStatus !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Game is already over' }, { status: 400 });
    }

    // Add the guess
    const multiplayerGuess: MultiplayerGuess = {
      playerId,
      guess,
      timestamp: new Date().toISOString(),
    };

    const updatedSession = addGuessToSession(sessionId, multiplayerGuess);
    if (!updatedSession) {
      return NextResponse.json({ error: 'Failed to add guess' }, { status: 500 });
    }

    // Check win condition
    let gameStatus = updatedSession.gameStatus;
    let winnerId = updatedSession.winnerId;

    if (guess === updatedSession.puzzle) {
      gameStatus = 'WON';
      winnerId = playerId;
    } else if (updatedSession.guesses.length >= 12) {
      // 6 guesses per player = 12 total
      gameStatus = 'LOST';
    }

    // Toggle turn
    const nextTurn = session.currentTurn === 'creator' ? 'opponent' : 'creator';

    const finalSession = updateSession(sessionId, {
      currentTurn: nextTurn,
      gameStatus,
      winnerId,
    });

    return NextResponse.json({ session: finalSession });
  } catch (error) {
    console.error('Error adding guess:', error);
    return NextResponse.json({ error: 'Failed to add guess' }, { status: 500 });
  }
}
