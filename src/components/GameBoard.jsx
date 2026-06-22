import React, { useEffect, useRef, useCallback } from 'react';
import { LEVELS } from '../constants';
import { makeBubble } from '../hooks/useGame';
import Bubble from './Bubble';
import StatusBar from './StatusBar';
import TargetBanner from './TargetBanner';

function FeedbackText({ feedback, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(feedback.id), 850);
    return () => clearTimeout(t);
  }, [feedback.id, onDone]);
  return (
    <>
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}60%{opacity:1;transform:translateY(-40px) scale(1.2)}100%{opacity:0;transform:translateY(-70px)}}`}</style>
      <span aria-live="polite" style={{
        position:'absolute', fontSize:22, fontWeight:900, pointerEvents:'none', zIndex:20,
        left: feedback.x - 20, top: feedback.y - 20,
        color: feedback.type === 'success' ? '#34d399' : '#f87171',
        animation: 'floatUp .85s ease-out forwards',
      }}>{feedback.text}</span>
    </>
  );
}

/* Pause overlay */
function PauseOverlay({ onResume, onQuit }) {
  return (
    <div style={s.overlay}>
      <div style={s.pauseCard}>
        <p style={s.pauseTitle}>⏸ Pause</p>
        <button style={s.resumeBtn} onClick={onResume}>▶ Reprendre</button>
        <button style={s.quitBtn}   onClick={onQuit}>✕ Menu</button>
      </div>
    </div>
  );
}

export default function GameBoard({ state, spawnBubble, hitBubble, missBubble, escapeBubble, removeFeedback, togglePause, quitToMenu }) {
  const { theme, level, score, lives, target, bubbles, feedbacks, phase } = state;
  const lvl     = LEVELS[level];
  const areaRef = useRef(null);
  const timer   = useRef(null);
  const paused  = phase === 'paused';

  const spawn = useCallback(() => {
    if (phase !== 'playing') return;
    const area = areaRef.current;
    if (!area) return;
    if (bubbles.length < lvl.maxBubbles) {
      spawnBubble(makeBubble(theme, area.offsetWidth || 380, area.offsetHeight || 500));
    }
    timer.current = setTimeout(spawn, lvl.spawnMs + (Math.random() - .5) * 500);
  }, [phase, bubbles.length, lvl.maxBubbles, lvl.spawnMs, theme, spawnBubble]);

  useEffect(() => {
    if (phase !== 'playing') { clearTimeout(timer.current); return; }
    timer.current = setTimeout(spawn, 400);
    return () => clearTimeout(timer.current);
  }, [phase]); // eslint-disable-line

  return (
    <div style={s.board}>
      <StatusBar
        score={score} lives={lives} level={level}
        paused={paused} onPause={togglePause} onQuit={quitToMenu}
      />
      <TargetBanner target={target} />

      <div style={s.area} ref={areaRef} aria-label="Zone de jeu">
        {bubbles.map(b => (
          <Bubble key={b.id} bubble={b} level={level} theme={theme} target={target}
            paused={paused}
            onHit={hitBubble} onMiss={missBubble} onEscape={escapeBubble} />
        ))}
        {feedbacks.map(f => (
          <FeedbackText key={f.id} feedback={f} onDone={removeFeedback} />
        ))}
        {paused && <PauseOverlay onResume={togglePause} onQuit={quitToMenu} />}
      </div>
    </div>
  );
}

const s = {
  board:   { display:'flex', flexDirection:'column', height:'100dvh', background:'#0D0D1A', overflow:'hidden' },
  area:    { flex:1, position:'relative', overflow:'hidden', background:'radial-gradient(ellipse at 20% 80%,#1a0a3a 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,#0a1a3a 0%,transparent 60%),#0D0D1A' },
  overlay: { position:'absolute', inset:0, background:'rgba(0,0,0,.65)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:30 },
  pauseCard:{ background:'#1a1a32', border:'1px solid #2a2a50', borderRadius:20, padding:'32px 40px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, minWidth:220 },
  pauseTitle:{ fontSize:28, fontWeight:900, margin:0 },
  resumeBtn:{ width:'100%', padding:'13px 0', borderRadius:50, border:'none', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif' },
  quitBtn:  { width:'100%', padding:'11px 0', borderRadius:50, border:'2px solid #2a2a50', background:'transparent', color:'#8b8ba8', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Nunito,sans-serif' },
};
