import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Calendar, Heart, Clock, ArrowDown } from 'lucide-react';

const HeroSection = ({ isOpened, onOpen }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: false });
  const [shakeBox, setShakeBox] = useState(false);

  // Compute countdown to July 12th
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let targetDate = new Date(currentYear, 6, 12); // July is month 6 (0-indexed)

      if (now > targetDate && now.getDate() !== 12) {
        targetDate.setFullYear(currentYear + 1);
      }

      const isBday = now.getMonth() === 6 && now.getDate() === 12;
      const difference = targetDate - now;

      if (isBday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true });
        return;
      }

      let days = Math.floor(difference / (1000 * 60 * 60 * 24));
      let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((difference / 1000 / 60) % 60);
      let seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isBirthday: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenGift = () => {
    setShakeBox(true);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.4);
      gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio failure:", e);
    }

    setTimeout(() => {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff2e93', '#00f0ff', '#ffbe0b', '#9d4edd']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff2e93', '#00f0ff', '#ffbe0b', '#9d4edd']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      onOpen();
    }, 600);
  };

  return (
    <section className="hero-section">
      {!isOpened ? (
        // GIFT ENTRY SCREEN
        <div className="flex flex-col items-center animate-fade-in">
          <div className="hero-incoming-badge">
            <span className="hero-incoming-dot" />
            <span>Surprise inside • July 12th</span>
          </div>
          
          <h1 className="hero-main-title text-center">
            You Received a <span className="animate-text-gradient">Secret Gift</span>
          </h1>
          <p className="hero-subtitle text-center">
            Someone made a special corner of the internet for <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Drishti Kakkar (laghdi)</span>. Click below to unwrap!
          </p>

          {/* Glowing Gift Box */}
          <div 
            onClick={handleOpenGift}
            className={`gift-box-container ${shakeBox ? 'animate-shake' : ''}`}
          >
            <div className="gift-box-glow" />
            <div className="gift-box-card">
              <Gift size={64} style={{ color: 'var(--primary)' }} />
              <span>Tap to Open</span>
            </div>
          </div>
        </div>
      ) : (
        // MAIN CELEBRATION HEADER
        <div className="celebrate-wrapper animate-fade-in text-center">
          <div className="celebrate-badge animate-float-slow">
            <Heart size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
            <span>Happy Birthday Laghdi!</span>
          </div>

          <h1 className="celebrate-title">
            DRISHTI KAKKAR
          </h1>
          <h2 className="celebrate-nickname font-heading">
            (laghdi)
          </h2>

          <p className="celebrate-desc">
            Welcome to the official, high-aesthetic tribute site loaded with gossip warnings, custom meme creators, cake simulators, and funny roasts for our favorite human!
          </p>

          {/* Countdown Clock Display */}
          <div className="countdown-box">
            <div className="countdown-header">
              <Calendar size={16} style={{ color: 'var(--primary)' }} />
              <span>Countdown to July 12th</span>
            </div>

            {timeLeft.isBirthday ? (
              <div className="text-center" style={{ padding: '16px 0' }}>
                <h3 className="animate-text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900 }}>
                  🎉 IT'S HER BIRTHDAY TODAY! 🎉
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                  Drishti Kakkar turns a year older and wiser (debatable)! Time to celebrate!
                </p>
              </div>
            ) : (
              <div className="countdown-grid">
                {[
                  { label: 'Days', value: timeLeft.days, color: 'var(--primary)' },
                  { label: 'Hours', value: timeLeft.hours, color: 'var(--secondary)' },
                  { label: 'Mins', value: timeLeft.minutes, color: 'var(--accent)' },
                  { label: 'Secs', value: timeLeft.seconds, color: 'var(--gold)' }
                ].map((item, idx) => {
                  // Re-evaluate dynamic colors to map correctly
                  let colorVal = 'var(--primary)';
                  if (idx === 1) colorVal = 'var(--secondary)';
                  if (idx === 2) colorVal = 'var(--accent)';
                  if (idx === 3) colorVal = 'var(--gold)';

                  return (
                    <div key={idx} className="countdown-card">
                      <span className="countdown-value font-mono" style={{ color: colorVal }}>
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="countdown-label">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scroll Down CTA */}
          <div 
            className="scroll-cta"
            onClick={() => {
              const target = document.getElementById('meme-gallery');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore The Memes</span>
            <ArrowDown size={18} />
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
