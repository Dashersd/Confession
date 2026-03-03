import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import ParticleBackground from './components/ParticleBackground';
import TypewriterText from './components/TypewriterText';
import { useAudio, AudioProvider } from './components/AudioProvider';

const AppContent = () => {
  // Scene names: start (initial), intro, envelope, confession, yes, wait
  const [scene, setScene] = useState('start');
  const [introLineIdx, setIntroLineIdx] = useState(0);
  const [showIntroButtons, setShowIntroButtons] = useState(false);
  const [bunnyActive, setBunnyActive] = useState(false);
  const [confessionLineIdx, setConfessionLineIdx] = useState(0);
  const [activeConfessionLines, setActiveConfessionLines] = useState([]);
  const [confessionPeak, setConfessionPeak] = useState(false);
  const [petalIntensity, setPetalIntensity] = useState(20);
  const [finalMessageVisible, setFinalMessageVisible] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [reply, setReply] = useState("");
  const { playBgm, playSfx } = useAudio();
  const idleTimer = useRef(null);

  const introScript = [
    "Some feelings bloom quietly…",
    "Like petals drifting in spring air.",
    "Soft. Unexpected. Impossible to ignore."
  ];

  const confessionScript = [
    "I didn’t notice when it started…",
    "Maybe it was the way your smile stayed in my thoughts.",
    "Or how everything felt lighter",
    "whenever you were near.",
    "It wasn’t loud.",
    "It didn’t rush in like a storm.",
    "It bloomed quietly…",
    "like soft pink petals in spring.",
    "Little by little,",
    "you became someone I look forward to.",
    "The comfort in my day.",
    "The warmth in small moments.",
    "And no matter how I tried to ignore it,",
    "my heart kept choosing you.",
    "So here I am —",
    "a little shy,",
    "very honest…",
    "and hoping.",
    "I like you.",
    "In a gentle, steady way",
    "that feels real."
  ];

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (scene === 'start') return;
    idleTimer.current = setTimeout(() => {
      setFinalMessageVisible(true);
    }, 12000);
  }, [scene]);

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    resetIdleTimer();
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  // Intro progress
  useEffect(() => {
    if (scene === 'intro') {
      if (introLineIdx < introScript.length) {
        const step = setTimeout(() => {
          setIntroLineIdx(idx => idx + 1);
        }, 3500);
        return () => clearTimeout(step);
      } else {
        const btnStep = setTimeout(() => setShowIntroButtons(true), 1500);
        return () => clearTimeout(btnStep);
      }
    }
  }, [scene, introLineIdx]);

  const handleEnter = () => {
    playBgm('bgm_intro'); // Matches existing key in AudioProvider
    setScene('intro');
  };

  const handleOpenOption = () => {
    playSfx('sfx_click');
    playBgm('bgm_letter'); // Matches existing key
    setScene('envelope');
  };

  const handleSealClick = () => {
    playSfx('sfx_click');
    setTimeout(() => playSfx('sfx_heartbeat'), 150);
    setTimeout(() => playSfx('sfx_paper'), 350);
    setTimeout(() => {
      setScene('confession');
      setActiveConfessionLines([confessionScript[0]]);
    }, 850);
  };

  const handleTypeComplete = () => {
    if (confessionLineIdx < confessionScript.length - 1) {
      setTimeout(() => {
        const nextIdx = confessionLineIdx + 1;
        const nextLine = confessionScript[nextIdx];
        setConfessionLineIdx(nextIdx);
        setActiveConfessionLines(prev => [...prev, nextLine]);

        // Emotional Peak: "I like you."
        if (nextLine === "I like you.") {
          setConfessionPeak(true);
          playSfx('sfx_heartbeat', 0.25);
          setPetalIntensity(50);
          // Single pulse effect
          setTimeout(() => {
            setConfessionPeak(false);
            setPetalIntensity(25);
          }, 2000);
        }
      }, 1000);
    }
  };

  const handleYes = () => {
    playSfx('sfx_chime');
    playBgm('bgm_yes'); // Brighter theme
    setScene('yes');
    setPetalIntensity(35);
  };

  const handleTime = () => {
    playBgm('bgm_wait'); // Patient theme
    setScene('wait');
  };

  const renderPetals = (count) => {
    return (
      <div className="petals-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="petal-fall" style={{
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
            opacity: 0.4 + Math.random() * 0.4,
            transform: `scale(${0.5 + Math.random()})`
          }} />
        ))}
      </div>
    );
  };

  return (
    <div className="app-main">
      <div className={`glow-breathing ${confessionPeak ? 'pulse-active' : ''}`} />
      <div className="vignette" />

      {/* Sakura Layer */}
      {renderPetals(petalIntensity)}

      {/* START SCREEN */}
      {scene === 'start' && (
        <div className="scene-container fade-in">
          <button onClick={handleEnter} style={{ letterSpacing: '0.4em', padding: '1.5rem 4rem' }}>🌸 Bloom 🌸</button>
        </div>
      )}

      {/* INTRO SCENE */}
      {scene === 'intro' && (
        <div className="scene-container">
          <div className="cinematic-text">
            {introScript.map((line, idx) => (
              idx <= introLineIdx && (
                <div key={idx} className="fade-line" style={{ animation: 'fadeIn 2s forwards', marginBottom: '1.5rem', opacity: 0 }}>{line}</div>
              )
            ))}
          </div>
          {showIntroButtons && (
            <div className="button-group fade-in" style={{ marginTop: '3rem', opacity: 0, animation: 'fadeIn 1s 1s forwards' }}>
              <button onClick={handleOpenOption}>💌 Open the letter</button>
              <button onClick={() => setBunnyActive(true)}>🌸 Wait a little</button>
            </div>
          )}
          {bunnyActive && (
            <div className="bunny-friend fade-in">
              🐰 <span style={{ fontSize: '0.9rem', color: '#bd8e62', fontStyle: 'italic' }}>That’s okay… I’ll stay here with you.</span>
            </div>
          )}
        </div>
      )}

      {/* ENVELOPE SCENE */}
      {scene === 'envelope' && (
        <div className="scene-container fade-in">
          <div className="envelope-wrapper" onClick={handleSealClick}>
            <div className="envelope">
              <div style={{ width: '100%', height: '100%', backgroundImage: 'url(/envelope.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.7 }} />
              <div className="seal-rose">❤</div>
            </div>
          </div>
          <p className="dim-text fade-in" style={{ marginTop: '3.5rem', letterSpacing: '0.2em', opacity: 0.6 }}>Touch the heart seal</p>
        </div>
      )}

      {/* CONFESSION SCENE */}
      {scene === 'confession' && (
        <div className="scene-container fade-in">
          <div className={`letter-unfold ${confessionPeak ? 'pulse-impact' : ''}`}>
            <div style={{ textAlign: 'left' }}>
              {activeConfessionLines.map((line, idx) => (
                <TypewriterText
                  key={idx}
                  text={line}
                  speed={35}
                  onComplete={idx === confessionLineIdx ? handleTypeComplete : null}
                  className={line === "I like you." ? "accent-line" : ""}
                />
              ))}
            </div>
            {confessionLineIdx === confessionScript.length - 1 && (
              <div className="button-group fade-in" style={{ marginTop: '4rem', opacity: 0, animation: 'fadeIn 1.5s forwards' }}>
                <button onClick={handleYes}>💖 Yes… I feel it too</button>
                <button onClick={handleTime}>🌙 I need a little time</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YES PATH */}
      {scene === 'yes' && (
        <div className="scene-container fade-in" style={{ background: 'radial-gradient(circle at center, rgba(255, 230, 200, 0.2), transparent)' }}>
          <div className="cinematic-text" style={{ paddingBottom: '3rem' }}>
            <div className="fade-line" style={{ color: '#ff8fa3', fontStyle: 'italic', animation: 'fadeIn 1.5s forwards' }}>You just made everything feel brighter…</div>
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s 2s forwards', opacity: 0 }}>Like the sky turning pink before sunrise.</div>
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s 4s forwards', opacity: 0 }}>I promise I won’t rush this.</div>
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s 6s forwards', opacity: 0, fontWeight: 500 }}>I just want something soft and beautiful — growing slowly with you.</div>

            <div className="button-group fade-in" style={{ marginTop: '4rem', opacity: 0, animation: 'fadeIn 1.5s 7.5s forwards' }}>
              <button onClick={() => playSfx('sfx_chime')}>🤍 Hold my hand</button>
              <button onClick={() => playSfx('sfx_chime')}>🎀 Pinky promise</button>
            </div>
          </div>
        </div>
      )}

      {/* WAIT PATH */}
      {scene === 'wait' && (
        <div className="scene-container fade-in" style={{ background: 'linear-gradient(to bottom, transparent, rgba(230, 230, 250, 0.2))' }}>
          <div className="cinematic-text">
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s forwards' }}>That’s okay…</div>
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s 2s forwards', opacity: 0 }}>Even blossoms take time before they fully open.</div>
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s 4s forwards', opacity: 0 }}>I care more about your comfort than any answer.</div>
            <div className="fade-line" style={{ animation: 'fadeIn 1.5s 6s forwards', opacity: 0 }}>I’ll stay right here — softly.</div>

            {!replyMode ? (
              <button onClick={() => setReplyMode(true)} style={{ marginTop: '3rem', fontSize: '0.8rem', letterSpacing: '0.1em' }} className="fade-in">✍️ Leave a small reply</button>
            ) : (
              <div className="reply-box fade-in" style={{ marginTop: '2rem' }}>
                <input
                  type="text"
                  placeholder="Type your reply here..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--text-main)', color: 'var(--text-main)', padding: '0.5rem', outline: 'none', width: '300px' }}
                />
                <button onClick={() => { localStorage.setItem('reply', reply); playSfx('sfx_chime'); setReplyMode(false); }} style={{ fontSize: '0.7rem' }}>Send</button>
              </div>
            )}
          </div>
        </div>
      )}

      {finalMessageVisible && (
        <div className="final-glow-text">
          No matter what… I’m glad I told you.
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
}
