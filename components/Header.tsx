'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Header() {
  const [glitchIndices, setGlitchIndices] = useState<number[]>([])
  const text = 'hiiiiiiiiiii.com'
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndices = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 }, 
        () => Math.floor(Math.random() * text.length)
      )
      setGlitchIndices(randomIndices)
      
      setTimeout(() => setGlitchIndices([]), 200)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b-2 border-neon-green bg-cyber-black/90 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4 flex justify-between items-center">
        <motion.a
          href="#"
          className="font-pixel text-base sm:text-xl md:text-2xl cursor-pointer hover:opacity-80 transition-opacity touch-manipulation"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {text.split('').map((char, index) => (
            <motion.span
              key={index}
              className={`inline-block ${glitchIndices.includes(index) ? 'text-neon-purple' : 'text-neon-green'} neon-glow`}
              animate={glitchIndices.includes(index) ? {
                y: [0, -5, 5, -3, 0],
                x: [0, 3, -3, 2, 0],
                rotate: [0, -5, 5, -2, 0]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.a>
        
        <motion.div 
          className="font-terminal text-xs sm:text-sm md:text-lg text-neon-purple"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="animate-flicker">[ONLINE]</span>
        </motion.div>
      </div>
    </header>
  )
}

