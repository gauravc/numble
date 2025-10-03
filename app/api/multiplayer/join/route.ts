import { NextRequest, NextResponse } from 'next/server';
import { joinSession, getSession } from '@/lib/multiplayerStorage';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, playerId } = await request.json();

    if (!sessionId || !playerId) {
      return NextResponse.json({ error: 'Session ID and Player ID are required' }, { status: 400 });
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (session.opponentId) {
      return NextResponse.json({ error: 'Session already has an opponent' }, { status: 400 });
    }

    if (session.creatorId === playerId) {
      return NextResponse.json({ error: 'Cannot join your own session' }, { status: 400 });
    }

    const updatedSession = joinSession(sessionId, playerId);

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error('Error joining session:', error);
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 });
  }
}
