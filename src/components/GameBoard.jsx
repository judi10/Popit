import React, { useEffect, useRef, useCallback } from 'react';
import { LEVELS } from '../constants';
import { makeBubble } from '../hooks/useGame';
import Bubble from './Bubble';
import StatusBar from './StatusBar';

export default function GameBoard({ state, spawnBubble, hitBubble, missBubble, escapeBubble, removeFeedback }) {
  const { theme, level, score, lives, round, roundTimeLeft, target, bubbles, feedbacks, phase } = state;
  const lvl     = LEVELS[level];
  const areaRef = useRef(null);
  const timer   = useRef(null);

  const spawn = useCallback(() => {
    if (phase !== 'playing') return;
    const area = areaRef.current;
    if (!area) return;
    if (bubbles.length < lvl.maxBubbles) {
      spawnBubble(makeBubble(theme, area.offsetWidth || 340, area.offsetHeight || 440));
    }
    timer.current = setTimeout(spawn, lvl.spawnMs + (Math.random() - .5) * 400);
  }, [phase, bubbles.length, lvl.maxBubbles, lvl.spawnMs, theme, spawnBubble]);

  useEffect(() => {
    if (phase !== 'playing') { clearTimeout(timer.current); return; }
    timer.current = setTimeout(spawn, 300);
    return () => clearTimeout(timer.current);
  }, [phase, round]); // eslint-disable-line

  return (
    <div style={s.board}>
      <StatusBar score={score} lives={lives} round={round} roundTimeLeft={roundTimeLeft} roundSec={lvl.roundSec} />

      {/* Target banner */}
      {target && (
        <div style={s.banner} aria-live="polite">
          <span style={s.bannerHint}>Touche les bulles →</span>
          <span style={{ ...s.chip, background: target.color + '22', border:`2px solid ${target.color}`, color: target.color }}>
            {target.icon ? `${target.icon} ` : ''}{target.label}
          </span>
        </div>
      )}

      {/* Bubble area */}
      <div style={s.area} ref={areaRef} aria-label="Zone de jeu">
        {bubbles.map(b => (
          <Bubble key={b.id} bubble={b} level={level} theme={theme} target={target}
            onHit={hitBubble} onMiss={missBubble} onEscape={escapeBubble} />
        ))}
        {feedbacks.map(f => (
          <FeedbackText key={f.id} feedback={f} onDone={removeFeedback} />
        ))}
      </div>
    </div>
  );
}

function FeedbackText({ feedback, onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(feedback.id), 850);
    return () => clearTimeout(t);
  }, [feedback.id, onDone]);

  return (
    <>
      <style>{`@keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}60%{opacity:1;transform:translateY(-40px) scale(1.15)}100%{opacity:0;transform:translateY(-70px)}}`}</style>
      <span aria-live="polite" style={{
        position:'absolute', fontSize:20, fontWeight:900, pointerEvents:'none', zIndex:20,
        left: feedback.x - 20, top: feedback.y - 20,
        color: feedback.type === 'success' ? '#34d399' : '#f87171',
        animation: 'floatUp .85s ease-out forwards',
      }}>
        {feedback.text}
      </span>
    </>
  );
}

const s = {
  board:      { display:'flex', flexDirection:'column', minHeight:'100vh', background:'#0D0D1A' },
  banner:     { display:'flex', alignItems:'center', justifyContent:'center', gap:10, margin:'8px 16px', padding:'10px 18px', background:'#1a1a32', border:'1px solid #2a2a50', borderRadius:12 },
  bannerHint: { fontSize:13, fontWeight:700, color:'#8b8ba8' },
  chip:       { fontSize:15, fontWeight:800, padding:'5px 14px', borderRadius:50, letterSpacing:.3 },
  area:       { flex:1, position:'relative', overflow:'hidden', minHeight:440, background:'radial-gradient(ellipse at 20% 80%,#1a0a3a 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,#0a1a3a 0%,transparent 60%),#0D0D1A' },
};
