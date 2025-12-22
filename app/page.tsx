'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Zap, Sparkles, Trophy, Mail, Github, Twitter } from 'lucide-react'
import Header from '@/components/Header'
import Game from '@/components/Game'

export default function Home() {
  const features = [
    { icon: Terminal, text: 'AI-Powered Development', color: 'text-neon-green' },
    { icon: Zap, text: 'Lightning Fast Delivery', color: 'text-neon-yellow' },
    { icon: Sparkles, text: 'Chaotic Good Vibes', color: 'text-neon-purple' },
  ]

  const leaderboard = [
    { rank: 1, name: 'SKYNET_2024', score: 99999, status: 'AI' },
    { rank: 2, name: 'HAL_9000', score: 88888, status: 'AI' },
    { rank: 3, name: 'YOU', score: '???', status: 'HUMAN?' },
    { rank: 4, name: 'CHATGPT', score: 77777, status: 'AI' },
    { rank: 5, name: 'COPILOT', score: 66666, status: 'AI' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    // Only handle Tab for smooth scrolling, let everything else work normally
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setTimeout(() => {
          const activeElement = document.activeElement
          if (activeElement) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }, 0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <motion.h1 
              className="font-pixel text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl text-neon-green mb-4 sm:mb-6 md:mb-8 leading-tight sm:leading-relaxed px-2"
              animate={{ 
                textShadow: [
                  '0 0 5px #00ff41, 0 0 10px #00ff41',
                  '0 0 8px #00ff41, 0 0 15px #00ff41',
                  '0 0 5px #00ff41, 0 0 10px #00ff41'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              The Most Artificial
              <br />
              <span className="text-neon-purple">Human Intelligence</span>
              <br />
              On The Web
            </motion.h1>
            
            <motion.p
              className="font-terminal text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-neon-blue mb-8 sm:mb-10 md:mb-12 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We build cool sh*t using the robots you fear.
            </motion.p>

            {/* Feature badges */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10 md:mb-12 px-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                  className="flex items-center gap-2 sm:gap-3 bg-cyber-dark border-2 border-neon-green px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded w-full sm:w-auto"
                >
                  <feature.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color} flex-shrink-0`} />
                  <span className="font-terminal text-base sm:text-lg md:text-xl text-white">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Game Section */}
          <motion.div
            id="game"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-12 sm:mb-16 md:mb-20 px-2 sm:px-0"
          >
            <div className="mb-4 sm:mb-6 md:mb-8 text-center px-2">
              <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neon-purple neon-glow-purple mb-2 sm:mb-3 md:mb-4">
                ⚡ MINI-GAME LOADING ⚡
              </h2>
              <p className="font-terminal text-base sm:text-lg md:text-xl lg:text-2xl text-neon-green">
                Can your Human Intelligence survive?
              </p>
            </div>
            <Game />
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 md:mb-20 border-2 sm:border-4 border-neon-purple rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark relative overflow-hidden mx-2 sm:mx-0"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-green to-neon-blue animate-pulse" />
            
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neon-purple mb-4 sm:mb-5 md:mb-6 text-center">
              WHO WE ARE
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl lg:text-2xl text-white space-y-2 sm:space-y-3 md:space-y-4">
              <p className="text-neon-green">
                {'>'} We&apos;re a studio labs company that builds apps and software.
              </p>
              <p className="text-neon-blue">
                {'>'} We use AI, but we call it &quot;Human Intelligence&quot; because irony is fun.
              </p>
              <p className="text-neon-yellow">
                {'>'} We don&apos;t do corporate. We do chaotic-good.
              </p>
              <p className="text-neon-purple">
                {'>'} We build the future, one bug at a time. 🐛
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact / Leaderboard Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-cyber-darker border-t-2 sm:border-t-4 border-neon-green">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-neon-green text-center mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-4">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              HIGH SCORES
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </h2>
            
            <div className="border-2 sm:border-4 border-neon-green rounded-lg overflow-hidden mb-8 sm:mb-10 md:mb-12">
              <div className="bg-cyber-black p-2 sm:p-3 md:p-4 border-b-2 border-neon-green">
                <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 font-pixel text-xs sm:text-sm md:text-base text-neon-yellow">
                  <div>RANK</div>
                  <div>PLAYER</div>
                  <div>SCORE</div>
                  <div>TYPE</div>
                </div>
              </div>
              
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-2 sm:p-3 md:p-4 border-b-2 border-cyber-dark ${
                    entry.name === 'YOU' ? 'bg-neon-purple/10 animate-pulse' : 'bg-cyber-darker'
                  }`}
                >
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 font-terminal text-sm sm:text-base md:text-lg lg:text-xl">
                    <div className="text-neon-yellow">#{entry.rank}</div>
                    <div className={`${entry.name === 'YOU' ? 'text-neon-purple font-pixel' : 'text-neon-green'} truncate`}>
                      {entry.name}
                    </div>
                    <div className="text-neon-blue">{entry.score}</div>
                    <div className={`${entry.status === 'AI' ? 'text-neon-green' : 'text-red-500'} text-xs sm:text-sm md:text-base`}>
                      {entry.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact CTAs */}
            <div className="text-center space-y-6 sm:space-y-8 px-2">
              <h3 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple">
                READY TO BUILD SOMETHING COOL?
              </h3>
              
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <a
                  href="mailto:hello@hiiiiiiiiiii.com"
                  className="arcade-button font-pixel text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-black uppercase flex items-center justify-center gap-2 sm:gap-3 touch-manipulation min-h-[44px]"
                >
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  Email Us
                </a>
                
                <button className="bg-cyber-dark border-2 border-neon-purple font-pixel text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center justify-center gap-2 sm:gap-3 touch-manipulation min-h-[44px]">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                  GitHub
                </button>
                
                <button className="bg-cyber-dark border-2 border-neon-blue font-pixel text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 text-neon-blue uppercase hover:bg-neon-blue hover:text-black transition-all flex items-center justify-center gap-2 sm:gap-3 touch-manipulation min-h-[44px]">
                  <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
                  Twitter
                </button>
              </div>

              <div className="font-terminal text-base sm:text-lg md:text-xl text-neon-green pt-4 sm:pt-6 md:pt-8">
                <p className="animate-flicker">
                  [ SYSTEM STATUS: ONLINE AND VIBING ]
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-3 sm:px-4 border-t-2 border-neon-green bg-cyber-black">
        <div className="container mx-auto text-center">
          <p className="font-terminal text-sm sm:text-base md:text-lg text-neon-green mb-2">
            © 2025 hiiiiiiiiiii.com - Human Intelligence Labs
          </p>
          <p className="font-terminal text-xs sm:text-sm text-neon-purple">
            Built with 🤖 and chaotic energy
          </p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-neon-green text-black font-pixel text-lg sm:text-xl rounded border-2 border-neon-green hover:bg-transparent hover:text-neon-green active:scale-95 transition-all z-50 touch-manipulation"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </main>
  )
}

