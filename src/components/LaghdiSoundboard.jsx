import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, ShieldAlert, Sparkles, MessageCircle, RotateCcw, Snowflake } from 'lucide-react';

const LaghdiSoundboard = () => {
  const [activeEffect, setActiveEffect] = useState(null);
  const [freezeOverlay, setFreezeOverlay] = useState(false);

  const getAudioContext = () => {
    return new (window.AudioContext || window.webkitAudioContext)();
  };

  const playSound = (type) => {
    setActiveEffect(type);
    const ctx = getAudioContext();

    if (type === 'tea') {
      const duration = 1.2;
      const count = 12;
      for (let i = 0; i < count; i++) {
        const time = ctx.currentTime + (i * duration) / count;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        const startFreq = 200 + Math.random() * 600;
        osc.frequency.setValueAtTime(startFreq, time);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 150, time + 0.08);
        
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        
        osc.start(time);
        osc.stop(time + 0.09);
      }
    } 
    
    else if (type === 'giggle') {
      const duration = 0.8;
      const chirps = 5;
      for (let i = 0; i < chirps; i++) {
        const time = ctx.currentTime + (i * duration) / chirps;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + (i * 40), time);
        osc.frequency.exponentialRampToValueAtTime(650 + (i * 40), time + 0.08);
        
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        
        osc.start(time);
        osc.stop(time + 0.09);
      }
    } 
    
    else if (type === 'siren') {
      const duration = 1.8;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      const speed = 6;
      for (let i = 0; i < duration * speed; i++) {
        const time = ctx.currentTime + i / speed;
        const freq = i % 2 === 0 ? 550 : 380;
        osc.frequency.setValueAtTime(freq, time);
      }
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } 
    
    else if (type === 'blast') {
      const duration = 1.0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);

      try {
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        
        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseNode.start();
      } catch (e) {
        console.log("Noise buffer failed", e);
      }

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#ef4444', '#ffbe0b', '#00f0ff']
      });
    }

    else if (type === 'freeze') {
      const duration = 2.0;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);

      setFreezeOverlay(true);
      setTimeout(() => {
        setFreezeOverlay(false);
      }, 2500);
    }

    setTimeout(() => {
      setActiveEffect(null);
    }, 2000);
  };

  const soundButtons = [
    {
      id: 'tea',
      title: "Spill the Tea 🍵",
      desc: "Instant gossip activator sound",
      glowColor: "yellow",
      icon: <MessageCircle className="w-8 h-8 text-yellow-400" />
    },
    {
      id: 'giggle',
      title: "Laghdi Giggle 🤭",
      desc: "Goofy high-pitched laugh track",
      glowColor: "pink",
      icon: <Sparkles className="w-8 h-8 text-pink-500" />
    },
    {
      id: 'siren',
      title: "Gossip Alert 🚨",
      desc: "Emergency tea-spilling broadcast",
      glowColor: "cyan",
      icon: <ShieldAlert className="w-8 h-8 text-cyan-400" />
    },
    {
      id: 'blast',
      title: "Cylinder Blast 💥",
      desc: "Meme-explosion with confetti",
      glowColor: "red",
      icon: <RotateCcw className="w-8 h-8 text-red-500" />
    },
    {
      id: 'freeze',
      title: "Brain Freeze ❄️",
      desc: "Freeze the screen in block of ice",
      glowColor: "sky",
      icon: <Snowflake className="w-8 h-8 text-sky-300" />
    }
  ];

  return (
    <section id="soundboard" className="soundboard-section container">
      {/* Freeze Overlay */}
      {freezeOverlay && (
        <div className="freeze-overlay">
          <div className="text-center glass-panel" style={{ padding: '32px', maxWidth: '350px' }}>
            <Snowflake className="w-16 h-16 text-sky-300 animate-spin mx-auto" style={{ marginBottom: '16px' }} />
            <h4 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>Screen Frozen!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Laghdi roasted someone so hard the system experienced critical temperature drop.</p>
          </div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="ice-crystal"
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="section-title-wrapper">
        <h2 className="section-title">
          LAGHDI'S <span className="animate-text-gradient">SOUNDBOARD</span>
        </h2>
        <p className="section-desc">
          Click any button below to trigger synthesized interactive sounds, full screen freezes, or custom visual reactions!
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="sound-grid">
        {soundButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => playSound(btn.id)}
            className="sound-card"
            style={activeEffect === btn.id ? { borderColor: 'var(--primary)', boxShadow: '0 0 15px var(--primary-glow)' } : {}}
          >
            <div className="sound-icon-wrapper">
              {btn.icon}
            </div>
            <h4 className="sound-title">{btn.title}</h4>
            <p className="sound-desc">{btn.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default LaghdiSoundboard;
