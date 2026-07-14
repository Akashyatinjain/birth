import React, { useState, useEffect, useRef } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import HeroSection from './components/HeroSection';
import MemeGallery from './components/MemeGallery';
import LaghdiSoundboard from './components/LaghdiSoundboard';
import BirthdayQuiz from './components/BirthdayQuiz';
import CakeCutting from './components/CakeCutting';
import WishWall from './components/WishWall';
import { Volume2, VolumeX, Heart } from 'lucide-react';

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const synthRef = useRef(null);

  // Synthesize background pad using Web Audio API (Fmaj7 - G6 - Em7 - Am7 progression)
  const startBackgroundMusic = () => {
    if (isPlayingMusic) return;
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const lowpass = audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(320, audioCtx.currentTime); // extra warm & soft
      
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 2); // fade-in
      
      lowpass.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      const chords = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00], // G6
        [164.81, 196.00, 246.94, 329.63], // Em7
        [220.00, 261.63, 329.63, 392.00]  // Am7
      ];

      let chordIndex = 0;
      const oscillators = [];
      const noteGains = [];

      for (let i = 0; i < 4; i++) {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(chords[chordIndex][i], audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        
        osc.connect(gainNode);
        gainNode.connect(lowpass);
        osc.start();
        
        oscillators.push(osc);
        noteGains.push(gainNode);
      }

      const interval = setInterval(() => {
        chordIndex = (chordIndex + 1) % chords.length;
        const fadeTime = 1.5;
        const now = audioCtx.currentTime;

        for (let i = 0; i < 4; i++) {
          noteGains[i].gain.setValueAtTime(noteGains[i].gain.value || 0.05, now);
          noteGains[i].gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
          
          oscillators[i].frequency.setValueAtTime(chords[chordIndex][i], now + fadeTime + 0.1);
          
          noteGains[i].gain.setValueAtTime(0.001, now + fadeTime + 0.2);
          noteGains[i].gain.exponentialRampToValueAtTime(0.05, now + fadeTime + 1.2);
        }
      }, 5000);

      noteGains.forEach((g) => {
        g.gain.setValueAtTime(0.001, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 1.5);
      });

      synthRef.current = {
        ctx: audioCtx,
        oscillators,
        noteGains,
        interval,
        masterGain
      };

      setIsPlayingMusic(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopBackgroundMusic = () => {
    if (!synthRef.current) return;
    const { ctx, oscillators, interval, masterGain } = synthRef.current;
    
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    setTimeout(() => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch(e){}
      });
      clearInterval(interval);
      synthRef.current = null;
      setIsPlayingMusic(false);
    }, 1100);
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  };

  const handleReveal = () => {
    setIsOpened(true);
    startBackgroundMusic();
  };

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        clearInterval(synthRef.current.interval);
        synthRef.current.oscillators.forEach(osc => {
          try { osc.stop(); } catch(e){}
        });
      }
    };
  }, []);

  return (
    <div className="flex-col" style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      <BackgroundParticles />
      <div className="gradient-overlay" />

      {/* Floating Header */}
      {isOpened && (
        <header className="header-nav">
          <div className="nav-brand">
            <Heart size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
            <span className="nav-logo-text">Drishti's Day</span>
          </div>

          {/* Quick scroll links */}
          <ul className="nav-links">
            <li><a href="#meme-gallery" className="nav-link">Memes</a></li>
            <li><a href="#soundboard" className="nav-link">Soundboard</a></li>
            <li><a href="#quiz" className="nav-link">Quiz</a></li>
            <li><a href="#cake-cutting" className="nav-link">Cake</a></li>
            <li><a href="#wish-wall" className="nav-link">Wish Wall</a></li>
          </ul>

          {/* Music Toggle */}
          <button 
            onClick={toggleMusic}
            className="music-btn"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 size={12} style={{ color: 'var(--primary)' }} className="animate-pulse" />
                <span>Pad Music On</span>
              </>
            ) : (
              <>
                <VolumeX size={12} style={{ color: 'var(--text-muted)' }} />
                <span>Music Muted</span>
              </>
            )}
          </button>
        </header>
      )}

      {/* Main Sections */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Gift Unwrap / Celebrate Header */}
        <HeroSection isOpened={isOpened} onOpen={handleReveal} />

        {/* Celebrate Sections */}
        {isOpened && (
          <div className="flex flex-col" style={{ gap: '20px', paddingBottom: '80px' }}>
            
            {/* Memes Gallery */}
            <MemeGallery />

            {/* Soundboard */}
            <LaghdiSoundboard />

            {/* Birthday Quiz */}
            <BirthdayQuiz />

            {/* Cake cutting */}
            <CakeCutting />

            {/* Wish Wall */}
            <WishWall />

            {/* Footer */}
            <footer className="footer-container">
              <p className="footer-desc">Created with 💖 for Drishti Kakkar (laghdi)</p>
              <p className="footer-desc" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Procedural Ambient Sound Synthesizer v1.0 • All Rights Reserved © 2026
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
