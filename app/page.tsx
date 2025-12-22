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
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="font-pixel text-4xl md:text-6xl lg:text-7xl text-neon-green mb-8 leading-relaxed"
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
              className="font-terminal text-2xl md:text-3xl lg:text-4xl text-neon-blue mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We build cool sh*t using the robots you fear.
            </motion.p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                  className="flex items-center gap-3 bg-cyber-dark border-2 border-neon-green px-6 py-3 rounded"
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  <span className="font-terminal text-xl text-white">{feature.text}</span>
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
            className="mb-20"
          >
            <div className="mb-8 text-center">
              <h2 className="font-pixel text-3xl md:text-4xl text-neon-purple neon-glow-purple mb-4">
                ⚡ MINI-GAME LOADING ⚡
              </h2>
              <p className="font-terminal text-xl md:text-2xl text-neon-green">
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
            className="mb-20 border-4 border-neon-purple rounded-lg p-8 bg-cyber-dark relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-green to-neon-blue animate-pulse" />
            
            <h2 className="font-pixel text-3xl md:text-4xl text-neon-purple mb-6 text-center">
              WHO WE ARE
            </h2>
            <div className="font-terminal text-xl md:text-2xl text-white space-y-4">
              <p className="text-neon-green">
                {'>'} We're a studio labs company that builds apps and software.
              </p>
              <p className="text-neon-blue">
                {'>'} We use AI, but we call it "Human Intelligence" because irony is fun.
              </p>
              <p className="text-neon-yellow">
                {'>'} We don't do corporate. We do chaotic-good.
              </p>
              <p className="text-neon-purple">
                {'>'} We build the future, one bug at a time. 🐛
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact / Leaderboard Section */}
      <section className="py-20 px-4 bg-cyber-darker border-t-4 border-neon-green">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-pixel text-3xl md:text-4xl text-neon-green text-center mb-8 flex items-center justify-center gap-4">
              <Trophy className="w-10 h-10" />
              HIGH SCORES
              <Trophy className="w-10 h-10" />
            </h2>
            
            <div className="border-4 border-neon-green rounded-lg overflow-hidden mb-12">
              <div className="bg-cyber-black p-4 border-b-2 border-neon-green">
                <div className="grid grid-cols-4 gap-4 font-pixel text-sm md:text-base text-neon-yellow">
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
                  className={`p-4 border-b-2 border-cyber-dark ${
                    entry.name === 'YOU' ? 'bg-neon-purple/10 animate-pulse' : 'bg-cyber-darker'
                  }`}
                >
                  <div className="grid grid-cols-4 gap-4 font-terminal text-lg md:text-xl">
                    <div className="text-neon-yellow">#{entry.rank}</div>
                    <div className={entry.name === 'YOU' ? 'text-neon-purple font-pixel' : 'text-neon-green'}>
                      {entry.name}
                    </div>
                    <div className="text-neon-blue">{entry.score}</div>
                    <div className={entry.status === 'AI' ? 'text-neon-green' : 'text-red-500'}>
                      {entry.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact CTAs */}
            <div className="text-center space-y-8">
              <h3 className="font-pixel text-2xl md:text-3xl text-neon-purple">
                READY TO BUILD SOMETHING COOL?
              </h3>
              
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:hello@hiiiiiiiiiii.com"
                  className="arcade-button font-pixel text-lg px-8 py-4 text-black uppercase flex items-center gap-3"
                >
                  <Mail className="w-6 h-6" />
                  Email Us
                </a>
                
                <button className="bg-cyber-dark border-2 border-neon-purple font-pixel text-lg px-8 py-4 text-neon-purple uppercase hover:bg-neon-purple hover:text-black transition-all flex items-center gap-3">
                  <Github className="w-6 h-6" />
                  GitHub
                </button>
                
                <button className="bg-cyber-dark border-2 border-neon-blue font-pixel text-lg px-8 py-4 text-neon-blue uppercase hover:bg-neon-blue hover:text-black transition-all flex items-center gap-3">
                  <Twitter className="w-6 h-6" />
                  Twitter
                </button>
              </div>

              <div className="font-terminal text-xl text-neon-green pt-8">
                <p className="animate-flicker">
                  [ SYSTEM STATUS: ONLINE AND VIBING ]
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t-2 border-neon-green bg-cyber-black">
        <div className="container mx-auto text-center">
          <p className="font-terminal text-lg text-neon-green mb-2">
            © 2025 hiiiiiiiiiii.com - Human Intelligence Labs
          </p>
          <p className="font-terminal text-sm text-neon-purple">
            Built with 🤖 and chaotic energy
          </p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-neon-green text-black font-pixel text-xl rounded border-2 border-neon-green hover:bg-transparent hover:text-neon-green transition-all z-50"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </main>
  )
}

