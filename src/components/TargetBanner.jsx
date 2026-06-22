import React from 'react';
import { LEVELS } from '../constants';
import './TargetBanner.css';

export default function TargetBanner({ target, level }) {
  if (!target) return null;
  const lvl = LEVELS[level];

  return (
    <div className="target-banner" aria-live="polite" aria-atomic="true">
      <span className="target-instruction">Touche les bulles →</span>
      <span className="target-chip" style={{ background: target.color + '22', border: `2px solid ${target.color}`, color: target.color }}>
        {target.icon ? `${target.icon} ` : ''}{target.label}
      </span>
    </div>
  );
}
