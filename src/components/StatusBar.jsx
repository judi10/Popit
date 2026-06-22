import React from 'react';
import { ROUNDS_PER_GAME, MAX_LIVES } from '../constants';

export default function StatusBar({ score, lives, round, roundTimeLeft, roundSec }) {
  const pct    = Math.max(0, (roundTimeLeft / roundSec) * 100);
  const urgent = pct < 30;

  return (
    <header style={s.bar} role="status" aria-label="Statut du jeu">
      <div style={s.block}>
        <span style={s.label}>Score</span>
        <span style={{ ...s.value, color:'#a78bfa' }}>{score}</span>
      </div>

      <div style={s.centerBlock}>
        <span style={s.label}>Round {round + 1} / {ROUNDS_PER_GAME}</span>
        <div style={s.barWrap} role="progressbar" aria-valuenow={roundTimeLeft} aria-valuemin={0} aria-valuemax={roundSec}>
          <div style={{ ...s.barFill, width:`${pct}%`, background: urgent ? 'linear-gradient(90deg,#f87171,#fbbf24)' : 'linear-gradient(90deg,#7c3aed,#2563eb)' }} />
        </div>
        <span style={{ ...s.label, color: urgent ? '#f87171' : '#5555aa' }}>{roundTimeLeft}s</span>
      </div>

      <div style={{ ...s.block, alignItems:'flex-end' }}>
        <span style={s.label}>Vies</span>
        <div style={s.hearts} aria-label={`${lives} vie(s)`}>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <span key={i} style={{ fontSize:18, opacity: i < lives ? 1 : 0.3 }}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

const s = {
  bar:        { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px 10px', borderBottom:'1px solid #2a2a50', background:'#0D0D1A', zIndex:10 },
  block:      { display:'flex', flexDirection:'column', gap:2, minWidth:60 },
  centerBlock:{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flex:1, padding:'0 16px' },
  label:      { fontSize:9, fontWeight:800, letterSpacing:1.5, color:'#5555aa', textTransform:'uppercase' },
  value:      { fontSize:22, fontWeight:900, color:'#fff' },
  barWrap:    { width:'100%', height:4, background:'#1a1a32', borderRadius:2, overflow:'hidden' },
  barFill:    { height:'100%', borderRadius:2, transition:'width .25s linear' },
  hearts:     { display:'flex', gap:3 },
};
