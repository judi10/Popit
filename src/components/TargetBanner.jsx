import React from 'react';

export default function TargetBanner({ target }) {
  if (!target) return null;
  return (
    <div style={s.banner} aria-live="polite" aria-atomic="true">
      <span style={s.hint}>Touche</span>
      <span style={{
        ...s.chip,
        background: target.color,
        boxShadow: `0 0 14px ${target.glow}bb`,
        minWidth: 48, height: 48,
        fontSize: 28,
      }}>
        {target.icon ? target.icon : null}
      </span>
    </div>
  );
}

const s = {
  banner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '8px 16px', padding: '10px 18px', background: '#1a1a32', border: '1px solid #2a2a50', borderRadius: 12 },
  hint:   { fontSize: 15, fontWeight: 700, color: '#8b8ba8' },
  chip:   { display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' },
};