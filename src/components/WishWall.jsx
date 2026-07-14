import React, { useState, useEffect } from 'react';
import { Heart, Flame, Plus, Quote, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const WishWall = () => {
  const preseededWishes = [
    {
      id: 1,
      sender: "Sneha",
      type: "roast",
      text: "Happy Birthday laghdi! Hope this year you finally learn how to reply to WhatsApp messages within the same calendar year. Love you! 😂",
      colorIdx: 0,
      date: "Jul 12, 2026"
    },
    {
      id: 2,
      sender: "Aarav",
      type: "heartfelt",
      text: "Happy Birthday Drishti! You are the absolute life of our group. Thank you for always bringing the energy and the tea! 💖",
      colorIdx: 1,
      date: "Jul 12, 2026"
    },
    {
      id: 3,
      sender: "Rohit",
      type: "roast",
      text: "Happy birthday! Please stop saying 'listen to me' and then proceeding to tell a 45-minute story about a random dog you saw on the street. 🐶",
      colorIdx: 2,
      date: "Jul 12, 2026"
    },
    {
      id: 4,
      sender: "Kabir",
      type: "heartfelt",
      text: "Happy birthday Drishti Kakkar! May your year be filled with zero cylinder photobombs and infinite gossip updates! Have a blast!",
      colorIdx: 3,
      date: "Jul 12, 2026"
    }
  ];

  const presetRoasts = [
    "Happy Birthday laghdi! May your replies become as fast as your speed when you spot gossip.",
    "Happy Birthday Drishti! I wish you a year where you actually stay awake past 10:00 PM on a weekend party.",
    "Happy Birthday! Hope you get sponsored by Indian Gas this year. Truly the main character of your photoshoot.",
    "Congrats on turning another year older! Still waiting for you to finish that story you started telling me in 2024.",
    "Happy Birthday! You're the only person who can sleep for 12 hours and wake up needing a nap."
  ];

  const presetWishes = [
    "Happy Birthday Drishti! Wishing you all the happiness, success, and fun in the world. You deserve the best!",
    "To the warmest and funniest person I know—happy birthday laghdi! Keep shining and laughing!",
    "Happy birthday Drishti! Thank you for being such an amazing friend. May all your dreams come true this year!",
    "Cheers to another year of crazy memories! Wishing you a wonderful birthday filled with love and laughter."
  ];

  const cardColors = [
    "border-pink-500/30 hover:border-pink-500/60 shadow-pink-500/5",
    "border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/5",
    "border-purple-500/30 hover:border-purple-500/60 shadow-purple-500/5",
    "border-yellow-500/30 hover:border-yellow-500/60 shadow-yellow-500/5"
  ];

  const [wishes, setWishes] = useState([]);
  const [sender, setSender] = useState('');
  const [wishType, setWishType] = useState('heartfelt');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('laghdi_wishes');
    if (saved) {
      setWishes(JSON.parse(saved));
    } else {
      setWishes(preseededWishes);
      localStorage.setItem('laghdi_wishes', JSON.stringify(preseededWishes));
    }
  }, []);

  const handlePostWish = (e) => {
    e.preventDefault();
    if (!sender.trim() || !message.trim()) return;

    const newWish = {
      id: Date.now(),
      sender: sender.trim(),
      type: wishType,
      text: message.trim(),
      colorIdx: Math.floor(Math.random() * cardColors.length),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    localStorage.setItem('laghdi_wishes', JSON.stringify(updated));

    setSender('');
    setMessage('');

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const handleQuickGenerate = () => {
    const arr = wishType === 'roast' ? presetRoasts : presetWishes;
    const rand = arr[Math.floor(Math.random() * arr.length)];
    setMessage(rand);
  };

  const handleResetWall = () => {
    if (window.confirm("Are you sure you want to reset the Wish Wall?")) {
      setWishes(preseededWishes);
      localStorage.setItem('laghdi_wishes', JSON.stringify(preseededWishes));
    }
  };

  return (
    <section id="wish-wall" className="wish-section container">
      {/* Header */}
      <div className="section-title-wrapper">
        <h2 className="section-title">
          THE LAGHDI <span className="animate-text-gradient">WISH WALL</span>
        </h2>
        <p className="section-desc">
          Leave Drishti Kakkar a birthday message. Pick either a sweet, heartfelt card or a friendly, fiery roast!
        </p>
      </div>

      <div className="wish-wall-layout">
        {/* Wish Form Panel */}
        <div className="wish-form-card">
          <h3 className="form-title">
            <Plus className="w-5 h-5 text-pink-500" /> Write a Card
          </h3>

          <form onSubmit={handlePostWish} className="form-element-wrapper">
            {/* Sender Name */}
            <div className="input-box">
              <label className="label-title">Your Name</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Rahul"
                maxLength={20}
                required
                className="text-input"
              />
            </div>

            {/* Wish Type Toggle */}
            <div className="input-box">
              <label className="label-title">Card Flavor</label>
              <div className="flavor-buttons-row">
                <button
                  type="button"
                  onClick={() => setWishType('heartfelt')}
                  className={`flavor-btn ${wishType === 'heartfelt' ? 'active-heartfelt' : ''}`}
                >
                  <Heart size={14} className={wishType === 'heartfelt' ? 'fill-pink-400' : ''} /> Heartfelt
                </button>
                <button
                  type="button"
                  onClick={() => setWishType('roast')}
                  className={`flavor-btn ${wishType === 'roast' ? 'active-roast' : ''}`}
                >
                  <Flame size={14} className={wishType === 'roast' ? 'fill-orange-400' : ''} /> Roast
                </button>
              </div>
            </div>

            {/* Message input */}
            <div className="input-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="label-title" style={{ margin: 0 }}>Your Message</label>
                <button
                  type="button"
                  onClick={handleQuickGenerate}
                  className="autofill-btn"
                >
                  <Sparkles size={10} /> Auto-fill roast
                </button>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={wishType === 'roast' ? "Write a funny burn..." : "Write a sweet birthday wish..."}
                maxLength={200}
                rows={4}
                required
                className="wish-textarea"
              />
            </div>

            {/* Post button */}
            <button
              type="submit"
              className="btn-neon btn-neon-pink"
              style={{ fontSize: '0.75rem', padding: '12px 24px', width: '100%', marginTop: '8px' }}
            >
              Pin to Wall ✨
            </button>
          </form>
        </div>

        {/* Board Wall Panel */}
        <div className="wall-cards-container">
          {/* Wall header controls */}
          <div className="wall-controls-row">
            <span className="wall-count-label">
              Total Messages: {wishes.length}
            </span>
            <button
              onClick={handleResetWall}
              className="wall-reset-btn"
            >
              Reset Wall Default
            </button>
          </div>

          {/* Messages list */}
          <div className="wishes-card-grid">
            {wishes.length === 0 ? (
              <div className="no-wishes-placeholder">
                <Quote className="w-12 h-12 text-slate-700" style={{ margin: '0 auto 8px' }} />
                <p className="no-wishes-desc">No notes pinned yet. Be the first one!</p>
              </div>
            ) : (
              wishes.map((w) => (
                <div
                  key={w.id}
                  className={`posted-wish-card ${cardColors[w.colorIdx]}`}
                >
                  {/* Top indicator */}
                  <div className="wish-type-indicator">
                    {w.type === 'roast' ? (
                      <Flame size={14} style={{ color: '#f97316', fill: '#f97316' }} />
                    ) : (
                      <Heart size={14} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                    )}
                  </div>

                  <p className="wish-card-text">
                    "{w.text}"
                  </p>

                  <div className="wish-card-footer">
                    <span className="wish-sender">
                      - {w.sender}
                    </span>
                    <span className="wish-date">
                      {w.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WishWall;
