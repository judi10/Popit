import React, { useRef } from 'react';
import { LEVELS, ROUNDS_PER_GAME } from '../constants';

const CONFETTI_COLORS = ['#a78bfa','#60a5fa','#34d399','#fbbf24','#f87171'];

export default function GameOver({ state, onReplay, onMenu, getBest }) {
  const { score, lives, level } = state;
  const best    = getBest(level);
  const isNewBest = score > 0 && score >= best;
  const confetti  = useRef(Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.floor(Math.random() * 6),
  })));

  const msg = score === 0    ? 'Essaie encore ! 💪'
    : score < 80   ? "Continue de t'entraîner ! 😊"
    : score < 160  ? 'Bien joué ! 🎯'
    : score < 280  ? "Excellent ! Tu as l'œil. ⚡"
    :                'Champion·ne ! 🏆';

  return (
    <div style={s.screen} aria-label="Fin de partie">
      <style>{`
        @keyframes cFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
        @keyframes bPop2{0%{transform:scale(.5);opacity:0}100%{transform:scale(1);opacity:1}}
        @media(prefers-reduced-motion:reduce){.confetti{animation:none!important}}
      `}</style>

      {/* Confetti */}
      {lives > 0 && (
        <div style={s.confettiWrap} aria-hidden="true">
          {confetti.current.map(c => (
            <div key={c.id} className="confetti" style={{
              position:'absolute', top:-10, left:`${c.x}%`,
              width:c.size, height:c.size, borderRadius:2,
              background:c.color,
              animation:`cFall 1.8s ease-in ${c.delay}s forwards`,
            }} />
          ))}
        </div>
      )}

      <h1 style={s.title}>{lives <= 0 ? '💥 Game Over' : '🎉 Bravo !'}</h1>

      {isNewBest && (
        <div style={s.badge} role="status" style={{ ...s.badge, animation:'bPop2 .4s cubic-bezier(.22,1,.36,1)' }}>
          ⭐ Nouveau record !
        </div>
      )}

      <div style={s.card} role="region" aria-label="Résultat">
        <div style={s.scoreMain}>
          <span style={s.scoreLabel}>Score</span>
          <span style={s.scoreNum}>{score}</span>
          <span style={s.scorePts}>points</span>
        </div>
        <div style={s.divider} />
        <div style={s.stats}>
          <Stat label="Niveau"        value={`${LEVELS[level].emoji} ${LEVELS[level].label}`} />
          <Stat label="Rounds"        value={ROUNDS_PER_GAME} />
          <Stat label="Meilleur score" value={`${best} pts`} highlight />
        </div>
      </div>

      <p style={s.msg}>{msg}</p>

      <div style={s.actions}>
        <button style={s.replayBtn} onClick={onReplay}>Rejouer</button>
        <button style={s.menuBtn}   onClick={onMenu}>← Menu</button>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
      <span style={{ color:'#8b8ba8' }}>{label}</span>
      <span style={{ fontWeight:700, color: highlight ? '#fbbf24' : '#fff' }}>{value}</span>
    </div>
  );
}

const s = {
  screen:      { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:'40px 24px', minHeight:'100vh', textAlign:'center', position:'relative', overflow:'hidden', background:'#0D0D1A' },
  confettiWrap:{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 },
  title:       { fontSize:38, fontWeight:900, position:'relative', zIndex:1 },
  badge:       { background:'linear-gradient(135deg,#fbbf24,#f97316)', color:'#1a0a00', fontSize:13, fontWeight:800, padding:'6px 18px', borderRadius:50, position:'relative', zIndex:1 },
  card:        { background:'#1a1a32', border:'1px solid #2a2a50', borderRadius:20, padding:'24px 32px', width:'100%', maxWidth:320, position:'relative', zIndex:1 },
  scoreMain:   { display:'flex', flexDirection:'column', alignItems:'center', gap:2, marginBottom:16 },
  scoreLabel:  { fontSize:10, fontWeight:800, letterSpacing:2, color:'#5555aa', textTransform:'uppercase' },
  scoreNum:    { fontSize:64, fontWeight:900, lineHeight:1, color:'#a78bfa' },
  scorePts:    { fontSize:14, color:'#8b8ba8' },
  divider:     { height:1, background:'#2a2a50', marginBottom:16 },
  stats:       { display:'flex', flexDirection:'column', gap:8 },
  msg:         { fontSize:17, fontWeight:700, color:'#a78bfa', position:'relative', zIndex:1 },
  actions:     { display:'flex', flexDirection:'column', gap:10, width:'100%', maxWidth:260, position:'relative', zIndex:1 },
  replayBtn:   { padding:'15px 0', borderRadius:50, border:'none', background:'linear-gradient(135deg,#7c3aed,#2563eb)', color:'#fff', fontSize:17, fontWeight:800, cursor:'pointer' },
  menuBtn:     { padding:'12px 0', borderRadius:50, border:'2px solid #2a2a50', background:'transparent', color:'#8b8ba8', fontSize:14, fontWeight:700, cursor:'pointer' },
};
