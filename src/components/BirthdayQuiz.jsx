import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, RefreshCw, ChevronRight, HelpCircle } from 'lucide-react';

const BirthdayQuiz = () => {
  const questions = [
    {
      id: 1,
      question: "What is Drishti Kakkar's most recognizable nickname?",
      options: [
        { text: "Guddu", isCorrect: false },
        { text: "Laghdi", isCorrect: true },
        { text: "Choti", isCorrect: false },
        { text: "Simran", isCorrect: false }
      ],
      comment: "Correct! If you got this wrong, you should leave this website right now! 😂"
    },
    {
      id: 2,
      question: "what Do you thing ,who is drishti according to the following option",
      options: [
        { text: "Runner", isCorrect: false },
        { text: "Sleeping Beauty", isCorrect: false },
        { text: "Beauty Queen", isCorrect: false },
        { text: "Diva (Station)", isCorrect: true }
      ],
      comment: "Exactly! Grab some popcorn and clear your schedule for the next half of the day. 🍿"
    },
    {
      id: 3,
      question: "What is Drishti's ultimate daily superpower?",
      options: [
        { text: "Sleeping 2 hours and still not having Dark circles ", isCorrect: true },
        { text: "Waking up at 5:00 AM to jog", isCorrect: false },
        { text: "Replying to messages in 0.5 seconds", isCorrect: false },
        { text: "Eating extremely spicy food without complaining", isCorrect: false }
      ],
      comment: "Literally a sleeping beauty, minus the waking up early part. 💤"
    },
    {
      id: 4,
      question: "How long does it take Drishti to roast someone who acts a bit too smart?",
      options: [
        { text: "10 working days with calculations", isCorrect: false },
        { text: "Exactly 0.2 seconds", isCorrect: true },
        { text: "She never roasts anyone, she is an angel", isCorrect: false },
        { text: "She waits for them to leave and then texts a roast", isCorrect: false }
      ],
      comment: "Fastest fingers in the west when it comes to savage replies! ⚡"
    },
    {
      id: 5,
      question: "Look at the meme photo with the Gas Cylinder in the background. What is Drishti doing?",
      options: [
        { text: "Trying to cooking dinner for everyone", isCorrect: false },
        { text: "Running a space program sponsored by Indian Gas", isCorrect: true },
        { text: "Demonstrating high-aesthetic cylinder maintenance", isCorrect: false },
        { text: "Moving it to another room because it fits her outfit color", isCorrect: false }
      ],
      comment: "Laghdi Space Program is launching soon! 🚀🛢️"
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const playFeedbackTone = (correct) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (correct) {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectOption = (optIdx, isCorrect) => {
    if (isAnswered) return;
    setSelectedOptIdx(optIdx);
    setIsAnswered(true);
    playFeedbackTone(isCorrect);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOptIdx(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const getResultFeedback = () => {
    if (score === 5) {
      return {
        title: "CERTIFIED GOSSIP PARTNER & BESTIE 🏆",
        desc: "You know laghdi inside out! She probably shares the tea with you before she even finishes brewing it! Absolute legend.",
        color: "text-green-400"
      };
    } else if (score >= 3) {
      return {
        title: "CASUAL TEA RECIPIENT 🍵",
        desc: "You have decent knowledge of Drishti, but you need to increase your phone call duration to catch up on the premium gossips!",
        color: "text-cyan-400"
      };
    } else {
      return {
        title: "PRACTICALLY A STRANGER 👤",
        desc: "Do you even know her? Or did you just stumble upon this link looking for free virtual cake? Time to read her memes again!",
        color: "text-red-400"
      };
    }
  };

  const currentQuestion = questions[currentIdx];
  const result = getResultFeedback();

  return (
    <section id="quiz" className="quiz-section container">
      {/* Header */}
      <div className="section-title-wrapper">
        <h2 className="section-title">
          HOW WELL DO YOU KNOW <span className="animate-text-gradient">LAGHDI?</span>
        </h2>
        <p className="section-desc">
          Take this quick trivia challenge to calculate your official closeness status with Drishti Kakkar.
        </p>
      </div>

      <div className="quiz-card">
        {!quizFinished ? (
          <div>
            {/* Progress bar */}
            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Info */}
            <div className="question-meta">
              <HelpCircle size={14} style={{ color: 'var(--primary)' }} /> Question {currentIdx + 1} of {questions.length}
            </div>

            <h3 className="question-text">
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div>
              {currentQuestion.options.map((opt, oIdx) => {
                let statusClass = "";
                if (isAnswered) {
                  if (opt.isCorrect) {
                    statusClass = "correct";
                  } else if (selectedOptIdx === oIdx) {
                    statusClass = "incorrect";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx, opt.isCorrect)}
                    disabled={isAnswered}
                    className={`option-btn ${statusClass}`}
                  >
                    <span>{opt.text}</span>
                    {isAnswered && opt.isCorrect && <CheckCircle size={16} style={{ color: '#34d399' }} />}
                    {isAnswered && selectedOptIdx === oIdx && !opt.isCorrect && <XCircle size={16} style={{ color: '#f87171' }} />}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {isAnswered && (
              <div className="feedback-container animate-fade-in">
                <p className="feedback-text">
                  {currentQuestion.comment}
                </p>
                <button
                  onClick={handleNext}
                  className="btn-neon btn-neon-pink"
                  style={{ fontSize: '0.7rem', padding: '10px 20px', alignSelf: 'flex-end' }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          // QUIZ FINISHED
          <div className="quiz-results">
            <Award size={64} style={{ color: 'var(--gold)', marginBottom: '16px' }} className="animate-float-slow" />

            <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Your final score:
            </span>
            <h3 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
              {score} / {questions.length}
            </h3>

            <h4 className="quiz-results-title" style={{ color: result.color === 'text-green-400' ? '#34d399' : result.color === 'text-cyan-400' ? 'var(--secondary)' : '#f87171' }}>
              {result.title}
            </h4>
            <p className="quiz-results-desc">
              {result.desc}
            </p>

            <button
              onClick={handleRestart}
              className="btn-neon btn-neon-outline"
              style={{ fontSize: '0.7rem', padding: '10px 20px' }}
            >
              <RefreshCw size={14} /> Restart Quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BirthdayQuiz;
