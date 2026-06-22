import React from 'react';
import { LEVELS } from '../constants';

export default function StatusBar({ score, lives, level, onPause, onQuit, paused }) {
  const lvl = LEVELS[level];
  const maxLives = lvl.lives;

  return (
    <header style={s.bar} role="status" aria-label="Statut du jeu">
      {/* Vies — gauche */}
      <div style={s.block}>
        <span style={s.label}>Vies</span>
        <div style={s.hearts} aria-label={`${lives} vie(s)`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <span key={i} style={{ fontSize: 22, opacity: i < lives ? 1 : 0.25, transition: 'opacity .2s' }}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {/* Score — centre */}
      <div style={s.centerBlock}>
        <span style={s.label}>Score</span>
        <span style={s.scoreVal}>{score}</span>
      </div>

      {/* Boutons — droite */}
      <div style={s.btnGroup}>
        <button style={s.iconBtn} onClick={onPause} aria-label={paused ? 'Reprendre' : 'Pause'}>
          {paused ? '▶' : '⏸'}
        </button>
        <button style={{ ...s.iconBtn, color: '#f87171' }} onClick={onQuit} aria-label="Quitter">
          ✕
        </button>
      </div>
    </header>
  );
}

const s = {
  bar:        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid #2a2a50', background: '#0D0D1A' },
  block:      { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minWidth: 80 },
  centerBlock:{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  label:      { fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: '#5555aa', textTransform: 'uppercase' },
  scoreVal:   { fontSize: 32, fontWeight: 900, color: '#a78bfa', lineHeight: 1 },
  btnGroup:   { display: 'flex', gap: 8, alignItems: 'center' },
  iconBtn:    { background: '#1a1a32', border: '1px solid #2a2a50', borderRadius: 8, color: '#ccc', fontSize: 16, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' },
  hearts:     { display: 'flex', gap: 3 },
};