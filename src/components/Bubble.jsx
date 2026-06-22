import React, { useEffect, useRef, useState } from 'react';
import { LEVELS, THEMES } from '../constants';

export default function Bubble({ bubble, level, theme, target, onHit, onMiss, onEscape, paused }) {
  const { id, item, size, x, startY, drift } = bubble;
  const [pos, setPos]   = useState({ x, y: startY });
  const [anim, setAnim] = useState('floating');
  const startTs  = useRef(null);
  const rafId    = useRef(null);
  const pauseRef = useRef(paused);
  const elapsed  = useRef(0);
  const done     = useRef(false);
  const isTarget = item.id === target?.id;

  /* keep pause ref in sync */
  useEffect(() => { pauseRef.current = paused; }, [paused]);

  useEffect(() => {
    const duration = LEVELS[level].lifetimeMs;
    const endY = -size - 20;

    function frame(now) {
      if (pauseRef.current) { rafId.current = requestAnimationFrame(frame); return; }
      if (!startTs.current) startTs.current = now - elapsed.current;
      elapsed.current = now - startTs.current;
      const prog = Math.min(elapsed.current / duration, 1);
      setPos({
        x: x + Math.sin(prog * Math.PI * 2.5) * drift * 0.4,
        y: startY + (endY - startY) * prog,
      });
      if (prog >= 1) {
        if (!done.current) { done.current = true; setAnim('gone'); onEscape(id, isTarget); }
        return;
      }
      rafId.current = requestAnimationFrame(frame);
    }

    rafId.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafId.current); };
  }, []); // eslint-disable-line

  function handleClick(e) {
    if (anim !== 'floating') return;
    cancelAnimationFrame(rafId.current);
    done.current = true;
    /* use center of button for feedback position */
    const r  = e.currentTarget.getBoundingClientRect();
    const pr = e.currentTarget.parentElement.getBoundingClientRect();
    const cx = r.left - pr.left + r.width  / 2;
    const cy = r.top  - pr.top  + r.height / 2;
    if (isTarget) { setAnim('pop');  onHit(id, cx, cy); }
    else          { setAnim('miss'); onMiss(id, cx, cy); }
  }

  if (anim === 'gone') return null;

  /* show icon for icon-mode themes; pure color for color theme */
  const themeData = THEMES[theme];
  const showIcon  = themeData.mode === 'icon' && item.icon;

  return (
    <>
      <style>{`
        @keyframes bPop  { 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.8);opacity:.6} 100%{transform:scale(0);opacity:0} }
        @keyframes bMiss { 0%{transform:scale(1);opacity:1} 100%{transform:scale(0.3) rotate(20deg);opacity:0} }
        @media(prefers-reduced-motion:reduce){ .b-pop,.b-miss{ animation:none!important; } }
      `}</style>
      <button
        className={anim === 'pop' ? 'b-pop' : anim === 'miss' ? 'b-miss' : ''}
        style={{
          position: 'absolute',
          width: size, height: size,
          /* hit area slightly larger than visual — easier to tap */
          padding: 8,
          left: pos.x - 8, top: pos.y - 8,
          borderRadius: '50%',
          border: 'none',
          background: item.color,
          boxShadow: `0 0 ${Math.round(size*.35)}px ${item.glow}cc,
                      inset -5px -5px 14px rgba(0,0,0,.25),
                      inset 4px 4px 10px rgba(255,255,255,.25)`,
          fontSize: Math.round(size * .5),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          animation: anim === 'pop' ? 'bPop .3s ease-out forwards'
                   : anim === 'miss' ? 'bMiss .3s ease-out forwards' : 'none',
          pointerEvents: anim !== 'floating' ? 'none' : 'all',
          zIndex: 5,
          lineHeight: 1,
          transition: 'transform .08s',
        }}
        onClick={handleClick}
        aria-label={`Bulle ${item.label}${isTarget ? ' — cible !' : ''}`}
      >
        {/* no text — just emoji or nothing (pure color bubbles stay empty) */}
        {showIcon ? item.icon : null}
      </button>
    </>
  );
}
