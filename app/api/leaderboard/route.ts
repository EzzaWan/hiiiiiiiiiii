import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const LEADERBOARD_KEY = 'debug_or_die_leaderboard'

// GET - Fetch leaderboard
export async function GET() {
  try {
    // Try to get from KV, fallback to empty array
    let leaderboard: Array<{ name: string; score: number; date: string }> = []
    
    try {
      const stored = await kv.get<Array<{ name: string; score: number; date: string }>>(LEADERBOARD_KEY)
      leaderboard = stored || []
    } catch (kvError) {
      // If KV is not configured, return empty leaderboard
      console.log('KV not configured, returning empty leaderboard')
      return NextResponse.json({ success: true, leaderboard: [] })
    }
    
    // Sort by score descending and return top 10
    const topScores = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    
    return NextResponse.json({ success: true, leaderboard: topScores })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

// POST - Add new score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, score } = body

    if (!name || typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid data' },
        { status: 400 }
      )
    }

    const newEntry = {
      name: name.trim().toUpperCase().slice(0, 15) || 'ANONYMOUS',
      score: Math.floor(score),
      date: new Date().toISOString(),
    }

    let leaderboard: Array<{ name: string; score: number; date: string }> = []
    
    try {
      // Get existing leaderboard from KV
      const stored = await kv.get<Array<{ name: string; score: number; date: string }>>(LEADERBOARD_KEY)
      leaderboard = stored || []
    } catch (kvError) {
      // If KV is not configured, use in-memory as fallback
      console.log('KV not configured, using in-memory storage')
    }

    // Add new entry
    leaderboard.push(newEntry)
    
    // Keep only top 100, sort by score descending
    leaderboard = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 100)

    // Save back to KV
    try {
      await kv.set(LEADERBOARD_KEY, leaderboard)
    } catch (kvError) {
      console.error('Failed to save to KV:', kvError)
      // Continue anyway, we'll return the updated leaderboard
    }

    const topScores = leaderboard.slice(0, 10)

    return NextResponse.json({ success: true, leaderboard: topScores })
  } catch (error) {
    console.error('Error saving score:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save score' },
      { status: 500 }
    )
  }
}
