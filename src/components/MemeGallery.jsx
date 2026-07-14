import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, RefreshCw, Smile } from 'lucide-react';
import laghdi1 from '../assets/laghdi1.png';
import laghdi2 from '../assets/laghdi2.png';
import laghdi3 from '../assets/laghdi3.png';
import laghdi4 from '../assets/laghdi4.png';
import chintuChatur from '../assets/chintu_chatur.png';
import kidnapper from '../assets/kidnapper.png';
import meme1 from '../assets/meme1.png';
import meme2 from '../assets/meme2.png';
import meme3 from '../assets/meme3.png';
import meme4 from '../assets/meme4.png';

const MemeGallery = () => {
  const memes = [
    {
      id: 1,
      image: laghdi1,
      title: "The 'So Basically...' Face",
      subtitle: "Gossip Level: Max",
      caption: "When someone says 'no gossip today' but then starts the sentence with 'so basically, I shouldn't be telling you this but...'"
    },
    {
      id: 2,
      image: laghdi2,
      title: "3 AM Existential Crisis",
      subtitle: "Brain: 404 Not Found",
      caption: "Me recalculating every single life decision that led to me staying up scrolling through reels at 3:15 AM."
    },
    {
      id: 3,
      image: laghdi3,
      title: "Cute but Savage",
      subtitle: "Roast Capability: 100%",
      caption: "A face that looks absolutely sweet, but possesses a roast library capable of ending entire careers in 5 seconds."
    },
    {
      id: 4,
      image: laghdi4,
      title: "Laghdi & The Cylinder",
      subtitle: "Indane Gas Collab",
      caption: "When you try to take a cute aesthetic video but the Red Gas Cylinder is determined to be the main character."
    },
    {
      id: 5,
      image: chintuChatur,
      title: "Chintu Chatur",
      subtitle: "Masterplan Loading...",
      caption: "The face she makes when she's already 3 steps ahead in the gossip game and you don't even know the tea has been brewed yet."
    },
    {
      id: 6,
      image: kidnapper,
      title: "Bachche Kidnap Karti Hai",
      subtitle: "FBI Most Wanted",
      caption: "Laghdi casually collecting children like Pokémon. 'Gotta catch 'em all!' Parents, hide your kids — Drishti is on the loose! 🚨"
    },
    {
      id: 7,
      image: meme1,
      title: "Cooking up Features",
      subtitle: "Full-Stack Chef",
      caption: "Me cooking up a new full-stack feature at 3 AM and hoping everything stays together."
    },
    {
      id: 8,
      image: meme2,
      title: "Juice Bar Smile",
      subtitle: "Code Compiles",
      caption: "My face when the code compiles successfully on the first try."
    },
    {
      id: 9,
      image: meme3,
      title: "Hair in the Wind",
      subtitle: "AWS Billing Panic",
      caption: "Running as fast as possible to shut down the AWS instance before the billing cycle hits."
    },
    {
      id: 10,
      image: meme4,
      title: "Productivity & Back Pain",
      subtitle: "The Developer Posture",
      caption: "Caught between maximum productivity and severe back pain while coding in bed."
    }
  ];

  const [selectedPhoto, setSelectedPhoto] = useState(memes[0].image);
  const [topText, setTopText] = useState('SO BASICALLY...');
  const [bottomText, setBottomText] = useState("I SHOULDN'T BE TELLING YOU");
  const [isGenerating, setIsGenerating] = useState(false);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    drawMeme();
  }, [selectedPhoto, topText, bottomText]);

  const drawMeme = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = selectedPhoto;
    img.onload = () => {
      const maxW = 500;
      const scale = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, 0, canvas.width, 60);
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

      ctx.font = '900 24px "Outfit", Impact, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Top text
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 30);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 30);

      // Bottom text
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 30);
    };
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `laghdi_meme_${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      setIsGenerating(false);
    }, 500);
  };

  return (
    <section id="meme-gallery" className="meme-section container">
      {/* Header */}
      <div className="section-title-wrapper">
        <h2 className="section-title">
          THE LAUGH BOARD & <span className="animate-text-gradient">MEMES</span>
        </h2>
        <p className="section-desc">
          We analyzed the uploaded files and distilled them into the most accurate, scientifically backed representations of Drishti Kakkar's daily vibes.
        </p>
      </div>

      {/* Grid of Memes */}
      <div className="meme-grid">
        {memes.map((m) => (
          <div key={m.id} className="meme-card">
            {/* Image Container */}
            <div className="meme-image-wrapper">
              <img
                src={m.image}
                alt={m.title}
                className="meme-img"
              />
              <div className="meme-card-badge">
                {m.subtitle}
              </div>
            </div>

            {/* Content */}
            <div className="meme-card-body">
              <div>
                <h3 className="meme-card-title">{m.title}</h3>
                <p className="meme-card-text">"{m.caption}"</p>
              </div>

              <button
                onClick={() => {
                  setSelectedPhoto(m.image);
                  const target = document.getElementById('meme-creator');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-neon btn-neon-outline"
                style={{ fontSize: '0.7rem', padding: '10px 20px', width: '100%' }}
              >
                <Smile size={14} /> Customize This
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Meme Creator Panel */}
      <div id="meme-creator" className="meme-creator-panel">
        <div className="creator-flex">
          {/* Canvas Preview Area */}
          <div className="preview-container">
            <span className="preview-label">
              <Camera size={14} style={{ color: 'var(--secondary)' }} /> Live Preview
            </span>

            <div className="canvas-border">
              <canvas
                ref={previewCanvasRef}
                className="meme-canvas"
              />
            </div>
          </div>

          {/* Settings Area */}
          <div className="settings-container">
            <div>
              <h3 className="settings-title">MEME GENERATOR 3000</h3>
              <p className="settings-desc">
                Pick a photo, write custom roasts, and generate a downloadable card to send Drishti Kakkar!
              </p>
            </div>

            {/* Select Image */}
            <div>
              <label className="label-title">1. Select Drishti's Mood</label>
              <div className="image-picker-grid">
                {memes.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(m.image)}
                    className={`picker-img-btn ${selectedPhoto === m.image ? 'active' : ''}`}
                  >
                    <img src={m.image} alt="" className="picker-img" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Texts */}
            <div className="flex flex-col gap-4">
              <div className="input-group">
                <label className="label-title">2. Top Text (Header Roast)</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  maxLength={40}
                  className="text-input"
                />
              </div>

              <div className="input-group">
                <label className="label-title">3. Bottom Text (The Punchline)</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  maxLength={40}
                  className="text-input"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4" style={{ marginTop: '8px' }}>
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="btn-neon btn-neon-pink"
                style={{ flexGrow: 1 }}
              >
                <Download size={16} />
                {isGenerating ? 'Generating...' : 'Download Meme'}
              </button>

              <button
                onClick={() => {
                  setTopText("SO BASICALLY...");
                  setBottomText("LAGHDI DOING LAGHDI THINGS");
                }}
                className="btn-neon btn-neon-outline"
                style={{ padding: '14px' }}
                title="Reset text"
              >
                <RefreshCw size={16} />
              </button>
            
                <button
                  onClick={async () => {
                    if (isGenerating) return;
                    setIsGenerating(true);
                    for (const m of memes) {
                      // draw each meme to an offscreen canvas and trigger download
                      await new Promise((res) => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.src = m.image;
                        img.onload = () => {
                          const maxW = 800;
                          const scale = maxW / img.width;
                          canvas.width = maxW;
                          canvas.height = img.height * scale;

                          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
                          ctx.fillRect(0, 0, canvas.width, 70);
                          ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

                          ctx.font = '900 36px "Outfit", Impact, sans-serif';
                          ctx.fillStyle = '#ffffff';
                          ctx.strokeStyle = '#000000';
                          ctx.lineWidth = 6;
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';

                          const top = (m.title || topText).toUpperCase();
                          const bottom = (m.caption || bottomText).toUpperCase();

                          ctx.strokeText(top, canvas.width / 2, 35);
                          ctx.fillText(top, canvas.width / 2, 35);

                          ctx.strokeText(bottom, canvas.width / 2, canvas.height - 35);
                          ctx.fillText(bottom, canvas.width / 2, canvas.height - 35);

                          const dataURL = canvas.toDataURL('image/png');
                          const link = document.createElement('a');
                          const safeName = (m.title || `meme_${m.id}`).replace(/\s+/g, '_').toLowerCase();
                          link.download = `${safeName}_${m.id}.png`;
                          link.href = dataURL;
                          link.click();
                          // small delay so browsers don't block rapid downloads
                          setTimeout(res, 350);
                        };
                        img.onerror = () => res();
                      });
                    }
                    setIsGenerating(false);
                  }}
                  disabled={isGenerating}
                  className="btn-neon btn-neon-outline"
                  style={{ padding: '14px' }}
                  title="Generate memes for all photos"
                >
                  <Download size={16} /> Generate All
                </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemeGallery;
