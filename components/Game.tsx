'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  
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

  // --- MAIN LOGIC ---
  useEffect(() => {
    // Load High Score
    const stored = typeof window !== 'undefined' ? localStorage.getItem('hi_score') : '0'
    if (stored) setHighScore(parseInt(stored))

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
    
    // 4. High Score Logic
    const currentScore = Math.floor(state.current.score / 10)
    if (currentScore > highScore) {
        setHighScore(currentScore)
        localStorage.setItem('hi_score', currentScore.toString())
    }
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
            <button 
              onClick={startGame} 
              className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase"
            >
              Start Game
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GAME OVER SCREEN - matching site style */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
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
            <button 
              onClick={startGame} 
              className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase"
            >
              Retry
            </button>
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
