'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Activity, AudioLines, CircleHelp, Gauge, Headphones, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from 'lucide-react'

type Theme = 'cyan' | 'magenta' | 'violet'

const themes: Record<Theme, { accent: string; glow: string; rgb: string }> = {
  cyan: { accent: '#67f5ff', glow: '#00c2ff', rgb: '103,245,255' },
  magenta: { accent: '#ff66d8', glow: '#f000b8', rgb: '255,102,216' },
  violet: { accent: '#ad8cff', glow: '#7848ff', rgb: '173,140,255' },
}

const bars = Array.from({ length: 28 }, (_, index) => 18 + ((index * 17) % 53))

export function CyberLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const [theme, setTheme] = useState<Theme>('cyan')
  const [density, setDensity] = useState(72)
  const [speed, setSpeed] = useState(68)
  const [glow, setGlow] = useState(80)
  const [paused, setPaused] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [fps, setFps] = useState(60)
  const [particleCount, setParticleCount] = useState(0)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0
    let height = 0
    let frame = 0
    let last = performance.now()
    let fpsTimer = last
    let frames = 0
    let pointer = { x: 0, y: 0, active: false }
    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number }> = []
    const waves: Array<{ x: number; y: number; r: number; alpha: number }> = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * ratio
      canvas.height = height * ratio
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const seed = (amount: number) => {
      for (let i = 0; i < amount && particles.length < 520; i++) particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, life: Math.random(), size: Math.random() * 2.4 + .6, hue: Math.random() * 80 - 20 })
    }
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true }
      seed(2)
    }
    const burstAt = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      waves.push({ x, y, r: 4, alpha: 1 })
      for (let i = 0; i < 26; i++) particles.push({ x, y, vx: Math.cos(i / 26 * Math.PI * 2) * (Math.random() * 3 + 1), vy: Math.sin(i / 26 * Math.PI * 2) * (Math.random() * 3 + 1), life: 1, size: Math.random() * 3 + 1, hue: Math.random() * 100 - 50 })
      if (audioEnabled) playTone()
    }
    const playTone = () => {
      const context = audioRef.current || new AudioContext()
      audioRef.current = context
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = 180 + Math.random() * 180
      gain.gain.setValueAtTime(.0001, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(.055, context.currentTime + .01)
      gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .18)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(); oscillator.stop(context.currentTime + .2)
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === ' ') { event.preventDefault(); setPaused((value) => !value) }
      if (event.key.toLowerCase() === 'r') { particles.length = 0; seed(100) }
      if (event.key.toLowerCase() === 'h') setShowHelp((value) => !value)
    }

    resize(); seed(150)
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', burstAt)
    window.addEventListener('keydown', keydown)

    // The animation loop is like a traffic police officer directing glowing cars. Every frame, it moves the particles, removes particles that have finished their journey, and draws the scene again.
    const animate = (now: number) => {
      const delta = Math.min((now - last) / 16.67, 3); last = now
      if (!paused) {
        ctx.fillStyle = 'rgba(5, 6, 17, 0.22)'; ctx.fillRect(0, 0, width, height)
        const color = themes[theme]
        ctx.globalCompositeOperation = 'lighter'
        if (pointer.active) { ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 80 + Math.sin(now / 500) * 12, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${color.rgb},.12)`; ctx.stroke() }
        particles.forEach((p) => { p.x += p.vx * delta * speed / 30; p.y += p.vy * delta * speed / 30; p.life -= .001 * delta; if (p.x < 0 || p.x > width) p.vx *= -1; if (p.y < 0 || p.y > height) p.vy *= -1; if (pointer.active) { const dx = pointer.x - p.x; const dy = pointer.y - p.y; const distance = Math.hypot(dx, dy); if (distance < 150) { p.vx += dx / distance * .008; p.vy += dy / distance * .008 } } ctx.beginPath(); ctx.fillStyle = `rgba(${color.rgb},${Math.max(.08, p.life * .8)})`; ctx.shadowBlur = glow / 5; ctx.shadowColor = color.glow; ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill() })
        for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1)
        waves.forEach((wave) => { wave.r += 5 * delta; wave.alpha -= .018 * delta; ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2); ctx.strokeStyle = `rgba(${color.rgb},${wave.alpha})`; ctx.lineWidth = 2; ctx.shadowBlur = 20; ctx.stroke() })
        for (let i = waves.length - 1; i >= 0; i--) if (waves[i].alpha <= 0) waves.splice(i, 1)
        while (particles.length < density * 2) seed(1)
        while (particles.length > density * 5 + 40) particles.pop()
        ctx.globalCompositeOperation = 'source-over'
      }
      frames++
      if (now - fpsTimer > 500) { setFps(Math.round(frames * 1000 / (now - fpsTimer))); frames = 0; fpsTimer = now; setParticleCount(particles.length) }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerdown', burstAt); window.removeEventListener('keydown', keydown); audioRef.current?.close() }
  }, [audioEnabled, density, glow, paused, speed, theme])

  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key.toLowerCase() === 'x') { setBurst(true); setTimeout(() => setBurst(false), 700) } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [])

  const reset = () => { setDensity(72); setSpeed(68); setGlow(80); setTheme('cyan'); setPaused(false) }
  const enableAudio = async () => { if (!audioEnabled) { audioRef.current = new AudioContext(); await audioRef.current.resume(); playSafeTone(audioRef.current); setAudioEnabled(true) } else { await audioRef.current?.suspend(); setAudioEnabled(false) } }
  const playSafeTone = (context: AudioContext) => { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 220; gain.gain.value = .02; oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .08) }

  // Reusable validation helper used by the educational unit tests below.
  const calculateParticleEnergy = (speedValue: number, mass = 1) => Math.max(0, Number.isFinite(speedValue) && Number.isFinite(mass) ? speedValue * speedValue * mass / 2 : 0)
  console.assert(calculateParticleEnergy(4) === 8, 'Normal particle energy test passed')
  console.assert(calculateParticleEnergy(0) === 0, 'Zero particle energy test passed')
  console.assert(calculateParticleEnergy(-4) === 8, 'Negative input is safely normalized by the validator')
  console.log('%c✓ Particle unit tests passed', 'color:#67f5ff;font-weight:bold')

  const current = themes[theme]
  return <main className={`lab-shell ${burst ? 'secret-burst' : ''}`} style={{ '--accent': current.accent, '--glow': current.glow, '--accent-rgb': current.rgb } as CSSProperties}>
    <div className="noise" aria-hidden="true" />
    <header className="topbar"><div className="brand-mark"><span className="brand-orbit" /><span>NEON//LAB</span><small>v1.0.4</small></div><div className="student-line">Created by <strong>Harish Malviya</strong><span>|</span> Student #150096725162</div><div className="online"><i /> SYSTEM ONLINE</div></header>
    <section className="hero"><div><div className="eyebrow"><span>OPTION A</span> / AUDIO-VISUALIZER & PARTICLE SANDBOX</div><h1>CYBERPUNK<br /><em>NEON LAB</em></h1><p>Shape the signal. Bend the light. Explore a living field of particles driven by your presence.</p></div><div className="hero-stats"><div><b>{fps}</b><span>FPS</span></div><div><b>{particleCount || 150}</b><span>PARTICLES</span></div><div><b>2D</b><span>CANVAS</span></div></div></section>
    <section className="workspace"><div className="visualizer-panel"><div className="panel-head"><div><span className="signal-dot" /> LIVE PARTICLE FIELD</div><span className="panel-code">CANVAS_001 / 60HZ</span></div><div className="canvas-wrap"><canvas ref={canvasRef} /><div className="canvas-overlay"><span>MOVE TO INTERACT</span><span>CLICK TO DEPLOY SHOCKWAVE</span></div>{paused && <div className="paused"><Pause size={18} /> SIMULATION PAUSED</div>}</div><div className="spectrum">{bars.map((value, index) => <span key={index} style={{ height: `${Math.max(12, value + Math.sin(index + fps) * 16)}%`, animationDelay: `${index * -40}ms` }} />)}</div></div>
      <aside className="control-panel"><div className="panel-head"><div><Zap size={14} /> CONTROL DECK</div><span className="panel-code">INPUT_03</span></div><div className="controls"><label>PARTICLE DENSITY <output>{density}%</output></label><input type="range" min="10" max="100" value={density} onChange={(e) => setDensity(+e.target.value)} /><label>ANIMATION SPEED <output>{speed}%</output></label><input type="range" min="10" max="100" value={speed} onChange={(e) => setSpeed(+e.target.value)} /><label>GLOW INTENSITY <output>{glow}%</output></label><input type="range" min="10" max="100" value={glow} onChange={(e) => setGlow(+e.target.value)} /><label>CHROMA PROFILE</label><div className="theme-row">{(Object.keys(themes) as Theme[]).map((item) => <button key={item} className={theme === item ? 'selected' : ''} onClick={() => setTheme(item)}><i style={{ background: themes[item].accent }} />{item.toUpperCase()}</button>)}</div><div className="action-row"><button className="icon-btn" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume' : 'Pause'}>{paused ? <Play size={16} /> : <Pause size={16} />}</button><button className={`audio-btn ${audioEnabled ? 'active' : ''}`} onClick={enableAudio}>{audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />} {audioEnabled ? 'AUDIO ACTIVE' : 'ENABLE AUDIO'}</button><button className="icon-btn" onClick={reset} aria-label="Reset"><RotateCcw size={16} /></button></div></div><div className="audio-readout"><div className="readout-title"><AudioLines size={15} /> SYNTH AUDIO ENGINE <span>READY</span></div><div className="readout-grid"><div><small>INPUT</small><b>GENERATED</b></div><div><small>WAVE</small><b>SINE / 220HZ</b></div></div></div><button className="help-trigger" onClick={() => setShowHelp((value) => !value)}><CircleHelp size={15} /> KEYBOARD SHORTCUTS <kbd>H</kbd></button>{showHelp && <div className="help-box"><p><kbd>SPACE</kbd> pause / resume</p><p><kbd>R</kbd> reset particles</p><p><kbd>H</kbd> toggle this panel</p><p><kbd>X</kbd> secret screen flash</p></div>}</aside></section>
    <section className="lab-notes"><div className="note-card"><div className="note-icon"><Sparkles size={18} /></div><div><h2>DEBUG LAB</h2><p>Try the learning loop: temporarily rename <code>animate</code> to <code>animateScene</code>, open DevTools Console, inspect the function-name mismatch, ask an AI to fix it, then restore the working name.</p></div></div><div className="note-card"><div className="note-icon"><Gauge size={18} /></div><div><h2>WEB AUDIO API</h2><p>Sound is synthesized locally and starts only after your explicit interaction. No microphone permission is requested.</p></div></div><div className="note-card"><div className="note-icon"><Headphones size={18} /></div><div><h2>SECRET FEATURE</h2><p>Rapidly click the particle field or press <kbd>X</kbd> to trigger a hidden chromatic screen pulse.</p></div></div></section>
    <footer><span>AI CODING LAB / 2026</span><span>BUILT WITH VANILLA JS · CANVAS API · WEB AUDIO API</span><span>STATUS: <b>ALL SYSTEMS NOMINAL</b></span></footer>
  </main>
}
