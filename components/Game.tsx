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
      const container = canvasRef.current.parentElement
      const width = container?.clientWidth || 800
      const height = window.innerWidth < 640 ? 400 : window.innerWidth < 768 ? 450 : 500
      
      canvasRef.current.width = width
      canvasRef.current.height = height
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        const groundY = height - 100
        ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0,0,width,height);
        ctx.strokeStyle = '#00ff41'; ctx.lineWidth = 4; 
        ctx.beginPath(); ctx.moveTo(0, groundY + 40); ctx.lineTo(width, groundY + 40); ctx.stroke();
        
        // Grid pattern like site
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)'
        ctx.lineWidth = 1
        for (let i = 0; i < width; i += 30) {
          ctx.beginPath()
          ctx.moveTo(i, groundY + 40)
          ctx.lineTo(i + 15, height)
          ctx.stroke()
        }
      }
    }
    
    // Handle window resize and orientation change
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const container = canvas.parentElement
      const width = container?.clientWidth || 800
      const height = window.innerWidth < 640 ? 400 : window.innerWidth < 768 ? 450 : 500
      
      canvas.width = width
      canvas.height = height
      
      if (!gameStarted) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const groundY = height - 100
          ctx.fillStyle = '#0a0a0a'
          ctx.fillRect(0, 0, width, height)
          ctx.strokeStyle = '#00ff41'
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.moveTo(0, groundY + 40)
          ctx.lineTo(width, groundY + 40)
          ctx.stroke()
        }
      }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100)
    })
    
    // Cleanup loop on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [gameStarted])

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
    const width = canvas.width
    const height = canvas.height
    const groundY = height - 100

    // 1. Clear & Background - matching site
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)
    
    // Floor
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.moveTo(0, groundY + 40); ctx.lineTo(width, groundY + 40); ctx.stroke();
    
    // Grid pattern
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)'
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 30) {
      ctx.beginPath()
      ctx.moveTo(i - (s.score % 30), groundY + 40)
      ctx.lineTo(i - (s.score % 30) + 15, height)
      ctx.stroke()
    }

    // 2. Player Physics
    s.player.velocity += 0.6 // Gravity
    s.player.y += s.player.velocity
    
    if (s.player.y > groundY - 40) { 
      s.player.y = groundY - 40
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
             x: width,
             y: Math.random() > 0.75 ? (groundY - 140) : (groundY - 40), 
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
    
    // Text - matching site font and style (responsive font size)
    const fontSize = width < 640 ? 12 : width < 768 ? 16 : 20
    ctx.font = `${fontSize}px "Press Start 2P"`
    ctx.fillStyle = '#00ff41'
    ctx.shadowBlur = 3
    ctx.shadowColor = '#00ff41'
    ctx.fillText(`SCORE: ${Math.floor(s.score / 10)}`, 10, 30)
    ctx.fillText(`HIGH: ${highScore}`, width - (fontSize * 12), 30)
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
    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] border-2 sm:border-4 border-neon-green rounded-lg overflow-hidden bg-cyber-darker touch-none">
      <canvas 
        ref={canvasRef}
        className="w-full h-full block cursor-pointer touch-none"
        onMouseDown={jump}
        onTouchStart={(e) => {
          e.preventDefault()
          jump()
        }}
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
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-neon-purple neon-glow-purple mb-3 sm:mb-4 px-4">
              DEBUG OR DIE
            </h2>
            <p className="font-terminal text-base sm:text-lg md:text-xl lg:text-2xl text-neon-green mb-4 sm:mb-6 md:mb-8 px-4">
              Press SPACE or TAP to start
            </p>
            <div className="font-terminal text-sm sm:text-base md:text-lg text-neon-blue mb-4 px-4">
              <p>🧠 = Human Intelligence</p>
              <p>🐛 = Bugs to avoid</p>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 px-4 w-full max-w-xs">
              <button 
                onClick={startGame} 
                className="arcade-button font-pixel text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-black uppercase touch-manipulation min-h-[44px]"
              >
                Start Game
              </button>
              {leaderboard.length > 0 && (
                <button 
                  onClick={() => setShowLeaderboard(true)} 
                  className="bg-cyber-dark border-2 border-neon-purple font-pixel text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
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
              className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-red-500 mb-3 sm:mb-4 px-4"
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
            <p className="font-terminal text-lg sm:text-xl md:text-2xl lg:text-3xl text-neon-purple mb-2 px-4">
              Human Intelligence Failed.
            </p>
            <p className="font-terminal text-base sm:text-lg md:text-xl lg:text-2xl text-neon-green mb-4 sm:mb-6 md:mb-8 px-4">
              Try AI? (Score: {score})
            </p>
            <div className="text-center mb-4 sm:mb-6 md:mb-8 font-terminal text-sm sm:text-base md:text-lg px-4">
              <p className="text-neon-green">SCORE: {score}</p>
              <p className="text-neon-yellow">HIGH: {highScore}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 w-full max-w-xs sm:max-w-none">
              <button 
                onClick={startGame} 
                className="arcade-button font-pixel text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-black uppercase touch-manipulation min-h-[44px]"
              >
                Retry
              </button>
              {leaderboard.length > 0 && (
                <button 
                  onClick={() => setShowLeaderboard(true)} 
                  className="bg-cyber-dark border-2 border-neon-purple font-pixel text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[44px]"
                >
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
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
              <h3 className="font-pixel text-lg sm:text-xl md:text-2xl text-neon-green mb-3 sm:mb-4 text-center px-4">
                🏆 NEW HIGH SCORE! 🏆
              </h3>
              <p className="font-terminal text-base sm:text-lg md:text-xl text-neon-blue mb-4 sm:mb-6 text-center px-4">
                Score: {score}
              </p>
              <p className="font-terminal text-sm sm:text-base md:text-lg text-white mb-3 sm:mb-4 text-center px-4">
                Enter your name for the leaderboard:
              </p>
              <form onSubmit={handleSubmitName} className="space-y-3 sm:space-y-4 px-4">
                <input
                  ref={nameInputRef}
                  type="text"
                  maxLength={15}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  className="w-full bg-cyber-black border-2 border-neon-green text-neon-green font-terminal text-base sm:text-lg md:text-xl p-3 sm:p-4 focus:outline-none focus:border-neon-purple uppercase touch-manipulation min-h-[44px]"
                  placeholder="YOUR NAME"
                  autoFocus
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    className="arcade-button font-pixel text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-black uppercase flex-1 touch-manipulation min-h-[44px]"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNameInput(false)
                      setPlayerName('')
                    }}
                    className="bg-cyber-dark border-2 border-neon-purple font-pixel text-sm sm:text-base md:text-lg px-4 sm:px-6 py-3 sm:py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all touch-manipulation min-h-[44px]"
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
              className="bg-cyber-dark border-2 sm:border-4 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 max-w-2xl w-full mx-4 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-green flex items-center gap-2 sm:gap-3">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-neon-yellow" />
                  LEADERBOARD
                </h2>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-neon-green hover:text-neon-purple transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close leaderboard"
                >
                  <X className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              </div>
              
              <div className="border-2 sm:border-4 border-neon-green rounded-lg overflow-hidden">
                <div className="bg-cyber-black p-2 sm:p-3 md:p-4 border-b-2 border-neon-green">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 font-pixel text-xs sm:text-sm md:text-base text-neon-yellow">
                    <div>RANK</div>
                    <div>PLAYER</div>
                    <div>SCORE</div>
                  </div>
                </div>
                
                {leaderboard.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center font-terminal text-base sm:text-lg md:text-xl text-neon-green">
                    No scores yet. Be the first!
                  </div>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.name}-${entry.date}-${index}`}
                      className={`p-2 sm:p-3 md:p-4 border-b-2 border-cyber-dark ${
                        index === 0 ? 'bg-neon-yellow/10' : 'bg-cyber-darker'
                      }`}
                    >
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 font-terminal text-sm sm:text-base md:text-lg lg:text-xl">
                        <div className="text-neon-yellow">#{index + 1}</div>
                        <div className={`${index === 0 ? 'text-neon-yellow font-pixel' : 'text-neon-green'} truncate`}>
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
                className="mt-4 sm:mt-6 w-full arcade-button font-pixel text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 text-black uppercase touch-manipulation min-h-[44px]"
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
