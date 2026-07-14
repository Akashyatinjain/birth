import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Sparkles } from 'lucide-react';

const CakeCutting = () => {
  const [candles, setCandles] = useState([
    { id: 1, lit: true, offset: '-30px' },
    { id: 2, lit: true, offset: '0px' },
    { id: 3, lit: true, offset: '30px' }
  ]);
  const [cakeCut, setCakeCut] = useState(false);
  const [isPlayingTune, setIsPlayingTune] = useState(false);

  const getAudioContext = () => {
    return new (window.AudioContext || window.webkitAudioContext)();
  };

  const playBlowSound = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBlowCandle = (id) => {
    setCandles(candles.map(c => c.id === id ? { ...c, lit: false } : c));
    playBlowSound();

    const remainingLit = candles.filter(c => c.id !== id ? c.lit : false).length;
    if (remainingLit === 0) {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }, 300);
    }
  };

  const playBirthdayTune = () => {
    if (isPlayingTune) return;
    setIsPlayingTune(true);
    
    try {
      const ctx = getAudioContext();
      const tempo = 1.3;
      const notes = [
        [261.63, 0.375], [261.63, 0.125], [293.66, 0.5], [261.63, 0.5], [349.23, 0.5], [329.63, 1.0],
        [261.63, 0.375], [261.63, 0.125], [293.66, 0.5], [261.63, 0.5], [392.00, 0.5], [349.23, 1.0],
        [261.63, 0.375], [261.63, 0.125], [523.25, 0.5], [440.00, 0.5], [349.23, 0.5], [329.63, 0.5], [293.66, 1.0],
        [466.16, 0.375], [466.16, 0.125], [440.00, 0.5], [349.23, 0.5], [392.00, 0.5], [349.23, 1.0]
      ];

      let scheduleTime = ctx.currentTime;

      notes.forEach(([freq, duration]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, scheduleTime);
        
        gain.gain.setValueAtTime(0, scheduleTime);
        gain.gain.linearRampToValueAtTime(0.12, scheduleTime + 0.03);
        gain.gain.setValueAtTime(0.12, scheduleTime + duration - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, scheduleTime + duration);
        
        osc.start(scheduleTime);
        osc.stop(scheduleTime + duration);
        
        scheduleTime += duration * tempo;
      });

      setTimeout(() => {
        setIsPlayingTune(false);
      }, (scheduleTime - ctx.currentTime) * 1000 + 500);

    } catch (e) {
      console.log(e);
      setIsPlayingTune(false);
    }
  };

  const handleCutCake = () => {
    if (cakeCut) return;
    setCakeCut(true);
    playBirthdayTune();

    const end = Date.now() + 2 * 1000;
    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ['#ff2e93', '#00f0ff', '#ffbe0b']
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ['#ff2e93', '#00f0ff', '#ffbe0b']
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleRelight = () => {
    setCandles(candles.map(c => ({ ...c, lit: true })));
    setCakeCut(false);
  };

  const allCandlesBlown = candles.filter(c => c.lit).length === 0;

  return (
    <section id="cake-cutting" className="cake-section container">
      {/* Header */}
      <div className="section-title-wrapper">
        <h2 className="section-title">
          VIRTUAL <span className="animate-text-gradient">CAKE CUTTING</span>
        </h2>
        <p className="section-desc">
          Click the candles to blow them out, then cut a slice of cake to hear our synthesized birthday tune!
        </p>
      </div>

      <div className="cake-card">
        {/* Instructions */}
        <div className="cake-instructions">
          {!allCandlesBlown ? (
            <span className="instruction-badge pink animate-pulse">
              1. Tap the candle flames to blow them out
            </span>
          ) : !cakeCut ? (
            <span className="instruction-badge cyan animate-pulse">
              2. Now tap the cake to cut it!
            </span>
          ) : (
            <span className="instruction-badge green">
              🎉 HAPPY BIRTHDAY LAGHDI!
            </span>
          )}
        </div>

        {/* Graphics Container */}
        <div className="cake-graphics-container">
          {/* Candles */}
          <div className="candles-row">
            {candles.map((candle) => (
              <div 
                key={candle.id} 
                className="candle-wrapper"
                style={{ 
                  left: `calc(50% + ${candle.offset})`,
                  top: candle.id === 2 ? '-6px' : '0px'
                }}
                onClick={() => candle.lit && handleBlowCandle(candle.id)}
              >
                {/* Flame */}
                {candle.lit ? (
                  <Flame className="candle-flame" size={24} style={{ color: 'var(--gold)', fill: 'orange' }} />
                ) : (
                  <div style={{ height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', opacity: 0.5 }}>💨</div>
                )}
                {/* Wax */}
                <div className={`candle-wax ${candle.lit ? 'lit' : 'blown'}`} />
              </div>
            ))}
          </div>

          {/* Graphical Cake */}
          <div 
            onClick={() => allCandlesBlown && handleCutCake()}
            className="cake-graphic-model"
            style={allCandlesBlown && !cakeCut ? { cursor: 'pointer' } : {}}
          >
            {/* Top Layer */}
            <div 
              className="cake-layer cake-layer-top"
              style={cakeCut ? { transform: 'translateX(-8px) rotate(-1deg)' } : {}}
            >
              {cakeCut && <div className="cake-cut-line" style={{ left: '50%' }} />}
            </div>

            {/* Middle Layer */}
            <div 
              className="cake-layer cake-layer-middle"
              style={cakeCut ? { transform: 'translateX(6px) rotate(1deg)' } : {}}
            >
              {cakeCut && <div className="cake-cut-line" style={{ left: '50%' }} />}
            </div>

            {/* Bottom Layer */}
            <div 
              className="cake-layer cake-layer-bottom"
              style={cakeCut ? { transform: 'translateX(-3px) rotate(-0.5deg)' } : {}}
            >
              {cakeCut && <div className="cake-cut-line" style={{ left: '52%' }} />}
            </div>

            {/* Stands */}
            <div className="cake-stand-top" />
            <div className="cake-stand-base" />
          </div>
        </div>

        {/* Celebration State UI */}
        {cakeCut && (
          <div className="text-center animate-fade-in" style={{ width: '100%', marginTop: '16px' }}>
            <h4 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Sparkles size={16} className="animate-spin" style={{ color: 'var(--gold)' }} /> 
              YUMMY SLICE SECURED! 
              <Sparkles size={16} className="animate-spin" style={{ color: 'var(--gold)' }} />
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '24px' }}>
              The cake has been virtually cut, triggering a cute chiptune rendition of Happy Birthday.
            </p>
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={playBirthdayTune}
                disabled={isPlayingTune}
                className="btn-neon btn-neon-pink"
                style={{ fontSize: '0.7rem', padding: '10px 20px' }}
              >
                {isPlayingTune ? 'Playing Melody...' : 'Replay Melody 🎵'}
              </button>
              <button 
                onClick={handleRelight}
                className="btn-neon btn-neon-outline"
                style={{ fontSize: '0.7rem', padding: '10px 20px' }}
              >
                Reset Cake 🎂
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CakeCutting;
