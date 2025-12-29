'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, RefreshCw } from 'lucide-react'

// --- TYPES ---
interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: 'SPIKE' | 'BLOCK'
  passed: boolean
}

interface Particle {
  x: number
  y: number
  life: number
  size: number
  color: string
}

export default function Game() {
  // --- REFS & STATE ---
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // UI States
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  
  // Game Logic State (Mutable Refs for 60FPS Performance)
  const state = useRef({
    player: { 
      x: 100, 
      y: 360, // Floor Level
      width: 40, 
      height: 40, 
      dy: 0, 
      rotation: 0,
      isGrounded: true,
      jumpForce: -16, // Increased base jump
      gravity: 0.7
    },
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    score: 0,
    speed: 2.7, // 10% slower (3 * 0.9)
    cameraOffset: 0,
    isGameActive: false,
    isHoldingJump: false,
    jumpHoldStart: 0,
    maxHoldDuration: 200 // Max 200ms hold for extra boost
  })
  
  const animationFrameId = useRef<number>()
  const isStartingGame = useRef(false)

  // --- LEADERBOARD LOGIC ---
  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      if (data.success && data.leaderboard) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('human_dash_leaderboard')
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
    if (typeof window !== 'undefined') {
      const storedHigh = localStorage.getItem('human_dash_hiscore')
      if (storedHigh) setHighScore(parseInt(storedHigh))
    }
  }

  const saveScore = async (name: string, score: number) => {
    // Save personal high score to localStorage
    if (typeof window !== 'undefined') {
      const storedHigh = localStorage.getItem('human_dash_hiscore')
      const currentHigh = storedHigh ? parseInt(storedHigh) : 0
      
      if (score > currentHigh) {
        localStorage.setItem('human_dash_hiscore', score.toString())
        setHighScore(score)
      }
    }

    // Save to leaderboard (localStorage and API)
    const newEntry: LeaderboardEntry = { 
      name: name.trim() || 'ANONYMOUS', 
      score, 
      date: new Date().toISOString() 
    }
    
    // Save to localStorage leaderboard
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('human_dash_leaderboard')
      const current = stored ? JSON.parse(stored) : []
      const updated = [...current, newEntry]
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 10)
      localStorage.setItem('human_dash_leaderboard', JSON.stringify(updated))
      setLeaderboard(updated)
    }

    // Save to API/DB
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEntry.name, score })
      })
      // Reload leaderboard from API to get the updated version
      const response = await fetch('/api/leaderboard')
      const data = await response.json()
      if (data.success && data.leaderboard) {
        setLeaderboard(data.leaderboard)
      }
    } catch (e) {
      console.warn('API save failed, using local only')
    }
  }

  // --- DRAWING FUNCTIONS (Cyberpunk Theme) ---
  
  // 1. Draw Player (Rotating Cube with Brain Icon)
  const drawPlayer = (ctx: CanvasRenderingContext2D, s: any) => {
    ctx.save()
    ctx.translate(s.player.x + s.player.width/2, s.player.y + s.player.height/2)
    ctx.rotate(s.player.rotation * Math.PI / 180)
    
    // Cube Body (Neon Green Border)
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(-s.player.width/2, -s.player.height/2, s.player.width, s.player.height)
    
    // Neon Green Outline (matching site)
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 3
    ctx.shadowColor = '#00ff41'
    ctx.shadowBlur = 5
    ctx.strokeRect(-s.player.width/2, -s.player.height/2, s.player.width, s.player.height)
    ctx.shadowBlur = 0

    // Inner "Brain" Icon (Purple/Pink matching site)
    ctx.fillStyle = '#b026ff'
    ctx.fillRect(-10, -10, 20, 20)
    // Green Eye
    ctx.fillStyle = '#00ff41'
    ctx.fillRect(2, -5, 6, 6)

    ctx.restore()
  }

  // 2. Draw Spikes (Red triangles - danger)
  const drawSpike = (ctx: CanvasRenderingContext2D, obs: Obstacle) => {
    ctx.beginPath()
    ctx.moveTo(obs.x, obs.y + obs.height)
    ctx.lineTo(obs.x + obs.width / 2, obs.y)
    ctx.lineTo(obs.x + obs.width, obs.y + obs.height)
    ctx.closePath()
    
    const gradient = ctx.createLinearGradient(obs.x, obs.y, obs.x, obs.y + obs.height)
    gradient.addColorStop(0, '#ff003c')
    gradient.addColorStop(1, '#500012')
    
    ctx.fillStyle = gradient
    ctx.shadowColor = '#ff003c'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.strokeStyle = '#ff003c'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // 3. Draw Blocks (Platforms with neon purple border)
  const drawBlock = (ctx: CanvasRenderingContext2D, obs: Obstacle) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
    
    // Neon Purple Border (matching site)
    ctx.strokeStyle = '#b026ff'
    ctx.lineWidth = 3
    ctx.shadowColor = '#b026ff'
    ctx.shadowBlur = 5
    ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
    ctx.shadowBlur = 0
    
    // Detail Lines (X pattern)
    ctx.beginPath()
    ctx.moveTo(obs.x, obs.y)
    ctx.lineTo(obs.x + obs.width, obs.y + obs.height)
    ctx.moveTo(obs.x + obs.width, obs.y)
    ctx.lineTo(obs.x, obs.y + obs.height)
    ctx.strokeStyle = 'rgba(176, 38, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // --- GAME LOOP ---
  const gameLoop = () => {
    if (!state.current.isGameActive) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const s = state.current
    
    // -- 1. UPDATE STATE --
    
    // Physics (Gravity)
    s.player.dy += s.player.gravity
    
    // Hold-to-jump-higher mechanic
    if (s.isHoldingJump && !s.player.isGrounded) {
      const holdDuration = Date.now() - s.jumpHoldStart
      if (holdDuration < s.maxHoldDuration) {
        // Apply additional upward force while holding (up to threshold)
        const holdBoost = Math.min(holdDuration / s.maxHoldDuration, 1) * 0.5 // Max 0.5 extra force
        s.player.dy -= holdBoost
      }
    }
    
    s.player.y += s.player.dy
    
    // Rotation logic
    if (!s.player.isGrounded) {
      s.player.rotation += 6
    } else {
      const remainder = s.player.rotation % 90
      if (remainder !== 0) {
        if (remainder < 45) s.player.rotation -= remainder
        else s.player.rotation += (90 - remainder)
      }
    }

    const floorY = 400 - s.player.height
    s.player.isGrounded = false
    let onPlatform = false

    // Collision Detection
    for (const obs of s.obstacles) {
      if (obs.type === 'SPIKE') {
        // More forgiving hitbox for spikes - only check if player is actually touching the spike
        // Spike hitbox: smaller margin, especially on sides and top
        const spikeMargin = 8 // More forgiving margin for spikes
        const playerCenterX = s.player.x + s.player.width / 2
        const playerCenterY = s.player.y + s.player.height / 2
        const spikeCenterX = obs.x + obs.width / 2
        const spikeTopY = obs.y
        
        // Check if player center is within spike bounds (more forgiving)
        if (
          playerCenterX > obs.x + spikeMargin &&
          playerCenterX < obs.x + obs.width - spikeMargin &&
          playerCenterY > spikeTopY - 5 && // Allow slight overlap at top
          playerCenterY < obs.y + obs.height - spikeMargin
        ) {
          handleGameOver()
          return
        }
      } else if (obs.type === 'BLOCK') {
        // Block collision (platforms) - keep original logic
        if (
          s.player.x < obs.x + obs.width - 5 &&
          s.player.x + s.player.width > obs.x + 5 &&
          s.player.y < obs.y + obs.height - 5 &&
          s.player.y + s.player.height > obs.y + 5
        ) {
          const playerBottom = s.player.y + s.player.height - s.player.dy
          if (s.player.dy > 0 && playerBottom <= obs.y + 10) {
            s.player.y = obs.y - s.player.height
            s.player.dy = 0
            s.player.isGrounded = true
            onPlatform = true
          } else {
            handleGameOver()
            return
          }
        }
      }
    }

    // Floor Collision
    if (!onPlatform) {
      if (s.player.y >= floorY) {
        s.player.y = floorY
        s.player.dy = 0
        s.player.isGrounded = true
      } else if (s.player.y > 600) {
        handleGameOver()
        return
      }
    }

    // Move Obstacles
    s.obstacles.forEach(obs => obs.x -= s.speed)
    
    // Spawning Logic
    if (s.obstacles.length === 0 || s.obstacles[s.obstacles.length - 1].x < 600) {
      spawnObstaclePattern(canvas.width)
    }
    
    s.obstacles = s.obstacles.filter(obs => obs.x > -100)
    
    // Score
    s.score++
    if (s.score % 1000 === 0) s.speed += 0.1 // Slower speed increase
    setScore(Math.floor(s.score / 10))

    // Particles (Trail)
    if (s.score % 5 === 0) {
      s.particles.push({
        x: s.player.x, y: s.player.y,
        life: 20, size: s.player.width, color: 'rgba(0, 255, 65, 0.4)'
      })
    }

    // -- 2. DRAWING --
    
    // Background (matching site dark)
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Moving Grid Background (Cyberpunk style)
    const gridOffset = (s.score * 2) % 50
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)'
    ctx.lineWidth = 1
    
    for (let x = -gridOffset; x < canvas.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 400)
      ctx.stroke()
    }
    for (let y = 400; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw Floor Line (Neon Green)
    ctx.shadowBlur = 10
    ctx.shadowColor = '#00ff41'
    ctx.strokeStyle = '#00ff41'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(0, 400)
    ctx.lineTo(canvas.width, 400)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Draw Particles (Trail)
    s.particles.forEach((p) => {
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life / 20
      ctx.fillRect(p.x, p.y, p.size, p.size)
      ctx.globalAlpha = 1.0
      p.life--
      p.x -= s.speed
    })
    s.particles = s.particles.filter(p => p.life > 0)

    // Draw Obstacles
    s.obstacles.forEach(obs => {
      if (obs.type === 'SPIKE') drawSpike(ctx, obs)
      else drawBlock(ctx, obs)
    })

    // Draw Player
    drawPlayer(ctx, s)

    // Draw Score (matching site font)
    ctx.font = '20px "Press Start 2P"'
    ctx.fillStyle = '#00ff41'
    ctx.shadowBlur = 3
    ctx.shadowColor = '#00ff41'
    ctx.textAlign = 'left'
    ctx.fillText(`SCORE: ${Math.floor(s.score / 10)}`, 20, 40)
    
    ctx.textAlign = 'right'
    ctx.fillStyle = '#b026ff'
    ctx.shadowColor = '#b026ff'
    ctx.fillText(`BEST: ${highScore}`, canvas.width - 20, 40)
    ctx.shadowBlur = 0

    animationFrameId.current = requestAnimationFrame(gameLoop)
  }

  // --- OBSTACLE PATTERNS ---
  const spawnObstaclePattern = (startX: number) => {
    const type = Math.random()
    const yFloor = 400
    
    if (type < 0.3) {
      state.current.obstacles.push({
        x: startX, y: yFloor - 40, width: 40, height: 40, type: 'SPIKE', passed: false
      })
    } else if (type < 0.5) {
      state.current.obstacles.push(
        { x: startX, y: yFloor - 40, width: 30, height: 40, type: 'SPIKE', passed: false },
        { x: startX + 30, y: yFloor - 40, width: 30, height: 40, type: 'SPIKE', passed: false },
        { x: startX + 60, y: yFloor - 40, width: 30, height: 40, type: 'SPIKE', passed: false }
      )
    } else if (type < 0.8) {
      state.current.obstacles.push({
        x: startX, y: yFloor - 50, width: 60, height: 50, type: 'BLOCK', passed: false
      })
      if (Math.random() > 0.5) {
         state.current.obstacles.push({
           x: startX + 150, y: yFloor - 40, width: 40, height: 40, type: 'SPIKE', passed: false
         })
      }
    } else {
      state.current.obstacles.push({
        x: startX, y: yFloor - 90, width: 80, height: 40, type: 'BLOCK', passed: false
      })
      state.current.obstacles.push({
        x: startX + 20, y: yFloor - 40, width: 40, height: 40, type: 'SPIKE', passed: false
      })
    }
  }

  const handleGameOver = () => {
    state.current.isGameActive = false
    setGameOver(true)
    setGameStarted(false)
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    
    const finalScore = Math.floor(state.current.score / 10)
    
    // Only show name input if it's a NEW personal high score (checked against localStorage)
    let storedHighScore = 0
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('human_dash_hiscore')
      if (stored) storedHighScore = parseInt(stored)
    }
    
    // Only show modal if this score beats the stored personal best
    if (finalScore > storedHighScore) {
      setTimeout(() => {
        setShowNameInput(true)
        if (nameInputRef.current) {
          nameInputRef.current.focus()
        }
      }, 500)
    }
  }

  const startGame = () => {
    // Prevent multiple calls
    if (state.current.isGameActive) return
    
    setGameStarted(true)
    setGameOver(false)
    setShowNameInput(false)
    setPlayerName('')
    setScore(0)
    
    state.current = {
      player: { x: 100, y: 360, width: 40, height: 40, dy: 0, rotation: 0, isGrounded: true, jumpForce: -16, gravity: 0.7 },
      obstacles: [],
      particles: [],
      score: 0,
      speed: 2.7, // 10% slower (3 * 0.9)
      cameraOffset: 0,
      isGameActive: true,
      isHoldingJump: false,
      jumpHoldStart: 0,
      maxHoldDuration: 200
    }
    gameLoop()
  }

  const handleJumpStart = (e?: any) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // If game is not active, start it (prevent multiple calls)
    if (!state.current.isGameActive && !isStartingGame.current) {
      isStartingGame.current = true
      startGame()
      setTimeout(() => { isStartingGame.current = false }, 100)
      return
    }

    // Jump only if game is active and player is grounded
    if (state.current.isGameActive && state.current.player.isGrounded) {
      state.current.player.dy = state.current.player.jumpForce
      state.current.player.isGrounded = false
      state.current.isHoldingJump = true
      state.current.jumpHoldStart = Date.now()
    }
  }

  const handleJumpEnd = (e?: any) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    state.current.isHoldingJump = false
  }

  // Canvas initialization - runs once on mount
  useEffect(() => {
    loadLeaderboard()

    // Init Canvas
    if (canvasRef.current) {
      canvasRef.current.width = 800
      canvasRef.current.height = 500
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#0a0a0a'
        ctx.fillRect(0, 0, 800, 500)
        ctx.strokeStyle = '#00ff41'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(0, 400)
        ctx.lineTo(800, 400)
        ctx.stroke()
        
        // Grid pattern
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
  }, [])

  // Keyboard event listeners - separate effect
  useEffect(() => {
    const kd = (e: KeyboardEvent) => { 
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        // Prevent key repeat from interfering
        if (e.repeat) return
        handleJumpStart(e)
      }
    }
    const ku = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        handleJumpEnd(e)
      }
    }
    window.addEventListener('keydown', kd, { passive: false })
    window.addEventListener('keyup', ku, { passive: false })
    
    return () => { 
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [])

  return (
    <div className="relative w-full h-[500px] border-4 border-neon-green rounded-lg overflow-hidden bg-cyber-darker">
      <canvas 
        ref={canvasRef}
        className="w-full h-full block cursor-pointer touch-none"
        onMouseDown={handleJumpStart}
        onMouseUp={handleJumpEnd}
        onMouseLeave={handleJumpEnd}
        onTouchStart={(e) => {
          e.preventDefault()
          handleJumpStart(e)
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          handleJumpEnd(e)
        }}
        onTouchCancel={(e) => {
          e.preventDefault()
          handleJumpEnd(e)
        }}
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
              HUMAN DASH
            </h2>
            <p className="font-terminal text-xl md:text-2xl text-neon-green mb-8">
              Press SPACE or TAP to jump
            </p>
            <div className="font-terminal text-lg text-neon-blue mb-4">
              <p>🟦 = Jump on platforms</p>
              <p>🔺 = Avoid spikes</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={startGame} 
                className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase"
              >
                Start Game
              </button>
              <button 
                onClick={() => setShowLeaderboard(true)} 
                className="bg-cyber-dark border-2 border-neon-purple font-pixel text-sm px-6 py-3 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                View Leaderboard
              </button>
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
              <button 
                onClick={() => setShowLeaderboard(true)} 
                className="bg-cyber-dark border-2 border-neon-purple font-pixel text-lg px-8 py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Leaderboard
              </button>
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
              <form onSubmit={(e) => {
                e.preventDefault()
                saveScore(playerName, score)
                setShowNameInput(false)
                setPlayerName('')
              }} className="space-y-4">
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
                  aria-label="Close leaderboard"
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
