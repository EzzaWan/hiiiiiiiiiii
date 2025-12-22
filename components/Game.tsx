'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy } from 'lucide-react'

interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  
  // REFS (Mutable state for performance)
  const state = useRef({
    player: { x: 100, y: 300, width: 40, height: 40, velocity: 0, jumping: false },
    obstacles: [] as any[],
    score: 0,
    speed: 4, 
    lastObstacleTime: 0,
    isGameActive: false // CRITICAL: Controls the loop instantly
  })
  
  const animationFrameId = useRef<number>()

  // --- BETTER ART FUNCTIONS ---
  const drawPixelBrain = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Pixelated brain - matching site style
    ctx.fillStyle = '#ff00ff' // Neon Pink/Purple
    ctx.shadowColor = '#ff00ff'
    ctx.shadowBlur = 5
    
    // Main Lobe
    ctx.fillRect(x + 5, y + 5, 30, 25) 
    // Frontal Lobe
    ctx.fillRect(x + 2, y + 10, 36, 15)
    // Stem
    ctx.fillStyle = '#bf00ff'
    ctx.fillRect(x + 15, y + 30, 10, 10)
    
    // Details (highlights)
    ctx.fillStyle = '#ff99ff' 
    ctx.fillRect(x + 10, y + 8, 6, 6)
    ctx.fillRect(x + 22, y + 12, 8, 4)
    
    // Eyes (neon green like site)
    ctx.fillStyle = '#00ff41'
    ctx.fillRect(x + 12, y + 12, 4, 4)
    ctx.fillRect(x + 24, y + 12, 4, 4)
    
    ctx.shadowBlur = 0
  }

  const drawSpaceInvader = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#ff0000' // Red bug
    ctx.shadowColor = '#ff0000'
    ctx.shadowBlur = 5
    
    // Draw bug/alien shape using rects
    // Body
    ctx.fillRect(x + 8, y + 8, 24, 16)
    // Ears/Horns
    ctx.fillRect(x + 2, y + 2, 8, 8)
    ctx.fillRect(x + 30, y + 2, 8, 8)
    // Arms
    ctx.fillRect(x, y + 14, 6, 12)
    ctx.fillRect(x + 34, y + 14, 6, 12)
    // Legs
    ctx.fillRect(x + 6, y + 30, 8, 8)
    ctx.fillRect(x + 26, y + 30, 8, 8)
    
    // Eyes (Black)
    ctx.fillStyle = '#000'
    ctx.fillRect(x + 10, y + 12, 6, 6)
    ctx.fillRect(x + 24, y + 12, 6, 6)
    
    ctx.shadowBlur = 0
  }

  // Load leaderboard from API
  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      
      if (data.success && data.leaderboard) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
      // Fallback to localStorage if API fails
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('debug_or_die_leaderboard')
        if (stored) {
          try {
            const entries = JSON.parse(stored) as LeaderboardEntry[]
            setLeaderboard(entries.sort((a, b) => b.score - a.score).slice(0, 10))
          } catch (e) {
            console.error('Failed to load from localStorage:', e)
          }
        }
      }
    }
    
    // Still load high score from localStorage (personal best)
    if (typeof window !== 'undefined') {
      const storedHigh = localStorage.getItem('hi_score')
      if (storedHigh) setHighScore(parseInt(storedHigh))
    }
  }

  // Save score to API (shared leaderboard)
  const saveScore = async (name: string, score: number) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      })
      
      const data = await response.json()
      
      if (data.success && data.leaderboard) {
        setLeaderboard(data.leaderboard)
      } else {
        throw new Error(data.error || 'Failed to save score')
      }
    } catch (error) {
      console.error('Failed to save score to API:', error)
      // Fallback to localStorage if API fails
      if (typeof window !== 'undefined') {
        const newEntry: LeaderboardEntry = {
          name: name.trim() || 'ANONYMOUS',
          score,
          date: new Date().toISOString()
        }
        
        const currentLeaderboard = leaderboard.length > 0 
          ? leaderboard 
          : (() => {
              const stored = localStorage.getItem('debug_or_die_leaderboard')
              return stored ? JSON.parse(stored) : []
            })()
        
        const updated = [...currentLeaderboard, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
        
        setLeaderboard(updated)
        localStorage.setItem('debug_or_die_leaderboard', JSON.stringify(updated))
      }
    }
    
    // Always save personal high score to localStorage
    if (score > highScore) {
      setHighScore(score)
      if (typeof window !== 'undefined') {
        localStorage.setItem('hi_score', score.toString())
      }
    }
  }

  // --- MAIN LOGIC ---
  useEffect(() => {
    loadLeaderboard()

    // Init Canvas Visuals - matching site colors
    if (canvasRef.current) {
      canvasRef.current.width = 800
      canvasRef.current.height = 500
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,800,500);
        ctx.strokeStyle = '#00ff41'; ctx.lineWidth = 4; 
        ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(800, 400); ctx.stroke();
        
        // Grid pattern like site
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)'
        ctx.lineWidth = 1
        for (let i = 0; i < 800; i += 30) {
          ctx.beginPath()
          ctx.moveTo(i, 400)
          ctx.lineTo(i + 15, 500)
          ctx.stroke()
        }
      }
    }
    
    // Cleanup loop on unmount
    return () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setShowNameInput(false)
    setPlayerName('')
    setScore(0)
    
    // Reset Logic State
    state.current = {
      player: { x: 100, y: 300, width: 40, height: 40, velocity: 0, jumping: false },
      obstacles: [],
      score: 0,
      speed: 4, // Easy mode speed
      lastObstacleTime: 0,
      isGameActive: true // Enable loop
    }
    
    gameLoop()
  }

  const gameLoop = () => {
    // CRITICAL: If game is not active, STOP.
    if (!state.current.isGameActive) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const s = state.current
    const now = Date.now()

    // 1. Clear & Background - matching site
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, 800, 500)
    
    // Floor
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.moveTo(0, 400); ctx.lineTo(800, 400); ctx.stroke();
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)'
    ctx.lineWidth = 1
    for (let i = 0; i < 800; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i - (s.score % 30), 400)
      ctx.lineTo(i - (s.score % 30) + 15, 500)
      ctx.stroke()
    }

    // 2. Player Physics
    s.player.velocity += 0.6 // Gravity
    s.player.y += s.player.velocity
    
    if (s.player.y > 360) { 
      s.player.y = 360
      s.player.velocity = 0
      s.player.jumping = false
    }

    // 3. Draw Player
    drawPixelBrain(ctx, s.player.x, s.player.y)

    // 4. Spawning Logic
    const minTimeGap = 1500 - (s.score * 2) 
    const timeSinceLast = now - s.lastObstacleTime

    if (timeSinceLast > Math.max(600, minTimeGap)) { 
       if (Math.random() > 0.6) { 
           s.obstacles.push({
             x: 800,
             y: Math.random() > 0.75 ? 260 : 360, 
             width: 40,
             height: 40
           })
           s.lastObstacleTime = now
       }
    }

    // Move & Draw Obstacles
    s.obstacles.forEach((obs) => {
        obs.x -= s.speed
        drawSpaceInvader(ctx, obs.x, obs.y)
        
        // Hitbox Collision
        if (
            s.player.x < obs.x + obs.width - 15 &&
            s.player.x + s.player.width > obs.x + 15 &&
            s.player.y < obs.y + obs.height - 15 &&
            s.player.y + s.player.height > obs.y + 15
        ) {
            handleGameOver() // DIE IMMEDIATELY
        }
    })
    
    // Cleanup offscreen
    s.obstacles = s.obstacles.filter(obs => obs.x > -50)

    // 5. Score
    s.score++
    if (s.score % 1000 === 0) s.speed += 0.5 
    setScore(Math.floor(s.score / 10))
    
    // Text - matching site font and style
    ctx.font = '20px "Press Start 2P"'
    ctx.fillStyle = '#00ff41'
    ctx.shadowBlur = 3
    ctx.shadowColor = '#00ff41'
    ctx.fillText(`SCORE: ${Math.floor(s.score / 10)}`, 20, 40)
    ctx.fillText(`HIGH: ${highScore}`, 680, 40)
    ctx.shadowBlur = 0

    // Keep loop going only if active
    if (state.current.isGameActive) {
        animationFrameId.current = requestAnimationFrame(gameLoop)
    }
  }

  const handleGameOver = () => {
    // 1. Kill the loop logic flag INSTANTLY
    state.current.isGameActive = false
    
    // 2. Cancel the frame request to be double sure
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    
    // 3. Update React State to show UI
    setGameOver(true)
    setGameStarted(false)
    
    // 4. Show name input if score is worth saving (top 10 or beat high score)
    const currentScore = Math.floor(state.current.score / 10)
    const minScoreToSave = leaderboard.length < 10 
      ? 0 
      : (leaderboard[leaderboard.length - 1]?.score || 0)
    
    if (currentScore >= minScoreToSave || currentScore > highScore) {
      setTimeout(() => {
        setShowNameInput(true)
        if (nameInputRef.current) {
          nameInputRef.current.focus()
        }
      }, 500)
    }
  }

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault()
    const currentScore = Math.floor(state.current.score / 10)
    saveScore(playerName, currentScore)
    setShowNameInput(false)
    setPlayerName('')
  }

  const jump = () => {
    if (!gameStarted) startGame()
    else if (!state.current.player.jumping && state.current.isGameActive) {
        state.current.player.velocity = -13 
        state.current.player.jumping = true
    }
  }

  return (
    <div className="relative w-full h-[500px] border-4 border-neon-green rounded-lg overflow-hidden bg-cyber-darker">
      <canvas 
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        onMouseDown={jump}
        onTouchStart={jump}
        onClick={jump}
      />

      {/* START SCREEN - matching site style */}
      <AnimatePresence>
        {!gameStarted && !gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <h2 className="font-pixel text-3xl md:text-5xl text-neon-purple neon-glow-purple mb-4">
              DEBUG OR DIE
            </h2>
            <p className="font-terminal text-xl md:text-2xl text-neon-green mb-8">
              Press SPACE or TAP to start
            </p>
            <div className="font-terminal text-lg text-neon-blue mb-4">
              <p>🧠 = Human Intelligence</p>
              <p>🐛 = Bugs to avoid</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={startGame} 
                className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase"
              >
                Start Game
              </button>
              {leaderboard.length > 0 && (
                <button 
                  onClick={() => setShowLeaderboard(true)} 
                  className="bg-cyber-dark border-2 border-neon-purple font-pixel text-sm px-6 py-3 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  View Leaderboard
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GAME OVER SCREEN - matching site style */}
      <AnimatePresence>
        {gameOver && !showNameInput && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-20"
          >
            <motion.h2
              className="font-pixel text-3xl md:text-5xl text-red-500 mb-4"
              animate={{ 
                textShadow: [
                  '0 0 10px #ff0000',
                  '0 0 20px #ff0000',
                  '0 0 10px #ff0000'
                ]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              SYSTEM FAILURE
            </motion.h2>
            <p className="font-terminal text-2xl md:text-3xl text-neon-purple mb-2">
              Human Intelligence Failed.
            </p>
            <p className="font-terminal text-xl md:text-2xl text-neon-green mb-8">
              Try AI? (Score: {score})
            </p>
            <div className="text-center mb-8 font-terminal text-lg">
              <p className="text-neon-green">SCORE: {score}</p>
              <p className="text-neon-yellow">HIGH: {highScore}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={startGame} 
                className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase"
              >
                Retry
              </button>
              {leaderboard.length > 0 && (
                <button 
                  onClick={() => setShowLeaderboard(true)} 
                  className="bg-cyber-dark border-2 border-neon-purple font-pixel text-lg px-8 py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Leaderboard
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAME INPUT MODAL */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-30"
          >
            <div className="bg-cyber-dark border-4 border-neon-green rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="font-pixel text-2xl text-neon-green mb-4 text-center">
                🏆 NEW HIGH SCORE! 🏆
              </h3>
              <p className="font-terminal text-xl text-neon-blue mb-6 text-center">
                Score: {score}
              </p>
              <p className="font-terminal text-lg text-white mb-4 text-center">
                Enter your name for the leaderboard:
              </p>
              <form onSubmit={handleSubmitName} className="space-y-4">
                <input
                  ref={nameInputRef}
                  type="text"
                  maxLength={15}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  className="w-full bg-cyber-black border-2 border-neon-green text-neon-green font-terminal text-xl p-4 focus:outline-none focus:border-neon-purple uppercase"
                  placeholder="YOUR NAME"
                  autoFocus
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase flex-1"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNameInput(false)
                      setPlayerName('')
                    }}
                    className="bg-cyber-dark border-2 border-neon-purple font-pixel text-lg px-6 py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all"
                  >
                    Skip
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEADERBOARD POPUP */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-cyber-dark border-4 border-neon-green rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-pixel text-3xl text-neon-green flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-neon-yellow" />
                  LEADERBOARD
                </h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-neon-green hover:text-neon-purple transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="border-4 border-neon-green rounded-lg overflow-hidden">
                <div className="bg-cyber-black p-4 border-b-2 border-neon-green">
                  <div className="grid grid-cols-3 gap-4 font-pixel text-sm md:text-base text-neon-yellow">
                    <div>RANK</div>
                    <div>PLAYER</div>
                    <div>SCORE</div>
                  </div>
                </div>
                
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center font-terminal text-xl text-neon-green">
                    No scores yet. Be the first!
                  </div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.name}-${entry.date}-${index}`}
                      className={`p-4 border-b-2 border-cyber-dark ${
                        index === 0 ? 'bg-neon-yellow/10' : 'bg-cyber-darker'
                      }`}
                    >
                      <div className="grid grid-cols-3 gap-4 font-terminal text-lg md:text-xl">
                        <div className="text-neon-yellow">#{index + 1}</div>
                        <div className={index === 0 ? 'text-neon-yellow font-pixel' : 'text-neon-green'}>
                          {entry.name}
                        </div>
                        <div className="text-neon-blue">{entry.score}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button
                onClick={() => setShowLeaderboard(false)}
                className="mt-6 w-full arcade-button font-pixel text-lg px-8 py-4 text-black uppercase"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Corner decorations - matching site */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-neon-green pointer-events-none" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-neon-green pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-neon-green pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-neon-green pointer-events-none" />
    </div>
  )
}
