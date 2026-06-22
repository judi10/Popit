import React from 'react';
import { THEMES, LEVELS } from '../constants';

export default function GameConfig({ state, setConfig, startGame, getBest }) {
  return (
    <main style={s.screen} aria-label="Configuration du jeu">
      <h1 style={s.title}>Popit!</h1>
      <p style={s.subtitle}>Jeu de mémoire</p>

      <Section label="Thème">
        <div style={s.row} role="group">
          {Object.entries(THEMES).map(([key, t]) => (
            <OptBtn key={key} selected={state.theme === key} onClick={() => setConfig('theme', key)}>
              <span style={s.optEmoji}>{t.emoji}</span>
              <span style={s.optName}>{t.name}</span>
            </OptBtn>
          ))}
        </div>
      </Section>

      <Section label="Niveau">
        <div style={s.row} role="group">
          {Object.entries(LEVELS).map(([key, lvl]) => (
            <OptBtn key={key} selected={state.level === key} onClick={() => setConfig('level', key)}>
              <span style={s.optEmoji}>{lvl.emoji}</span>
              <span style={s.optName}>{lvl.label}</span>
              <span style={s.optDesc}>{lvl.description}</span>
              <span style={s.optDesc}>{'❤️'.repeat(lvl.lives)} {lvl.lives} vie{lvl.lives > 1 ? 's' : ''}</span>
              {lvl.showBest && getBest(key) > 0 && (
                <span style={s.optBest}>Record : {getBest(key)} pts</span>
              )}
            </OptBtn>
          ))}
        </div>
      </Section>

      <button style={s.playBtn} onClick={startGame}>Jouer →</button>
    </main>
  );
}

function Section({ label, children }) {
  return (
    <section style={s.section}>
      <span style={s.sectionLabel}>{label}</span>
      {children}
    </section>
  );
}

function OptBtn({ selected, onClick, children }) {
  return (
    <button style={{ ...s.optBtn, ...(selected ? s.optBtnSel : {}) }} onClick={onClick} aria-pressed={selected}>
      {children}
    </button>
  );
}

const s = {
  screen:      { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 24px', minHeight: '100dvh', background: '#0D0D1A' },
  title:       { fontSize: 52, fontWeight: 900, letterSpacing: -2, background: 'linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textAlign: 'center', margin: 0 },
  subtitle:    { color: '#8b8ba8', fontSize: 15, textAlign: 'center', marginTop: -16 },
  section:     { width: '100%', maxWidth: 400, background: '#1a1a32', border: '1px solid #2a2a50', borderRadius: 20, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 },
  sectionLabel:{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: '#5555aa', textTransform: 'uppercase' },
  row:         { display: 'flex', gap: 10 },
  optBtn:      { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 8px', borderRadius: 12, border: '2px solid #2a2a50', background: '#12122a', color: '#e2e8f0', fontFamily: 'Nunito,sans-serif', transition: 'all .15s', textAlign: 'center', cursor: 'pointer' },
  optBtnSel:   { borderColor: '#a78bfa', background: '#2a1a5a', color: '#fff' },
  optEmoji:    { fontSize: 22 },
  optName:     { fontSize: 13, fontWeight: 700 },
  optDesc:     { fontSize: 10, color: '#94a3b8', lineHeight: 1.4 },
  optBest:     { fontSize: 10, color: '#fbbf24', fontWeight: 700, marginTop: 2 },
  playBtn:     { padding: '16px 56px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', fontSize: 18, fontWeight: 800, marginTop: 8, cursor: 'pointer', fontFamily: 'Nunito,sans-serif' },
};
