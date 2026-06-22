import React, { useEffect, useRef, useState } from 'react';
import { LEVELS, THEMES } from '../constants';

export default function Bubble({ bubble, level, theme, target, onHit, onMiss, onEscape }) {
  const { id, item, size, x, startY, drift } = bubble;
  const [pos, setPos]   = useState({ x, y: startY });
  const [anim, setAnim] = useState('floating');
  const startTs  = useRef(null);
  const rafId    = useRef(null);
  const done     = useRef(false);
  const isTarget = item.id === target?.id;

  useEffect(() => {
    const duration = LEVELS[level].lifetimeMs;
    const endY = -size - 20;

    function frame(now) {
      if (!startTs.current) startTs.current = now;
      const prog = Math.min((now - startTs.current) / duration, 1);
      setPos({
        x: x + Math.sin(prog * Math.PI * 3) * drift * 0.4,
        y: startY + (endY - startY) * prog,
      });
      if (prog >= 1) {
        if (!done.current) { done.current = true; setAnim('gone'); onEscape(id, isTarget); }
        return;
      }
      rafId.current = requestAnimationFrame(frame);
    }

    rafId.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId.current);
  }, []); // eslint-disable-line

  function handleClick(e) {
    if (anim !== 'floating') return;
    cancelAnimationFrame(rafId.current);
    done.current = true;
    const r  = e.currentTarget.getBoundingClientRect();
    const pr = e.currentTarget.parentElement.getBoundingClientRect();
    const cx = r.left - pr.left + r.width  / 2;
    const cy = r.top  - pr.top  + r.height / 2;
    if (isTarget) { setAnim('pop');  onHit(id, cx, cy); }
    else          { setAnim('miss'); onMiss(id, cx, cy); }
  }

  if (anim === 'gone') return null;

  const showIcon = THEMES[theme].mode === 'icon' || level === 'hard';

  return (
    <>
      <style>{`
        @keyframes bPop  { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.7);opacity:.7} 100%{transform:scale(0);opacity:0} }
        @keyframes bMiss { 0%{transform:scale(1);opacity:1} 100%{transform:scale(0) rotate(20deg);opacity:0} }
        @media(prefers-reduced-motion:reduce){ .bubble-pop,.bubble-miss{ animation:none!important; } }
      `}</style>
      <button
        className={anim === 'pop' ? 'bubble-pop' : anim === 'miss' ? 'bubble-miss' : ''}
        style={{
          position: 'absolute',
          width: size, height: size,
          left: pos.x, top: pos.y,
          borderRadius: '50%',
          border: 'none',
          background: item.color,
          boxShadow: `0 0 ${Math.round(size*.3)}px ${item.glow}99, inset -4px -4px 12px rgba(0,0,0,.3), inset 3px 3px 8px rgba(255,255,255,.2)`,
          fontSize: Math.round(size * .44),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          animation: anim === 'pop' ? 'bPop .28s ease-out forwards' : anim === 'miss' ? 'bMiss .28s ease-out forwards' : 'none',
          pointerEvents: anim !== 'floating' ? 'none' : 'all',
          zIndex: 5,
          lineHeight: 1,
        }}
        onClick={handleClick}
        aria-label={`Bulle ${item.label}${isTarget ? ' — cible !' : ''}`}
      >
        {showIcon && item.icon ? item.icon : null}
      </button>
    </>
  );
}
