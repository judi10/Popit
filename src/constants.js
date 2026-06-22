export const THEMES = {
  colors: {
    name: 'Couleurs', emoji: '🎨', mode: 'color',
    items: [
      { id: 'red',    label: 'Rouge',      color: '#ef4444', glow: '#7f1d1d', icon: null },
      { id: 'blue',   label: 'Bleu',       color: '#3b82f6', glow: '#1e3a8a', icon: null },
      { id: 'green',  label: 'Vert',       color: '#22c55e', glow: '#14532d', icon: null },
      { id: 'yellow', label: 'Jaune',      color: '#eab308', glow: '#713f12', icon: null },
      { id: 'purple', label: 'Violet',     color: '#a855f7', glow: '#3b0764', icon: null },
      { id: 'orange', label: 'Orange',     color: '#f97316', glow: '#7c2d12', icon: null },
    ],
  },
  animals: {
    name: 'Animaux', emoji: '🐾', mode: 'icon',
    items: [
      { id: 'dog',     label: 'Chien',      color: '#f97316', glow: '#431407', icon: '🐶' },
      { id: 'cat',     label: 'Chat',       color: '#a78bfa', glow: '#2e1065', icon: '🐱' },
      { id: 'frog',    label: 'Grenouille', color: '#4ade80', glow: '#052e16', icon: '🐸' },
      { id: 'fox',     label: 'Renard',     color: '#fb923c', glow: '#431407', icon: '🦊' },
      { id: 'penguin', label: 'Pingouin',   color: '#67e8f9', glow: '#083344', icon: '🐧' },
      { id: 'wolf',    label: 'Loup',       color: '#cbd5e1', glow: '#1e293b', icon: '🐺' },
    ],
  },
  nature: {
    name: 'Nature', emoji: '🌿', mode: 'icon',
    items: [
      { id: 'flower', label: 'Fleur',       color: '#f9a8d4', glow: '#500724', icon: '🌸' },
      { id: 'wave',   label: 'Vague',       color: '#38bdf8', glow: '#0c4a6e', icon: '🌊' },
      { id: 'shroom', label: 'Champignon',  color: '#fca5a5', glow: '#450a0a', icon: '🍄' },
      { id: 'star',   label: 'Étoile',      color: '#fde68a', glow: '#451a03', icon: '⭐' },
      { id: 'moon',   label: 'Lune',        color: '#e2e8f0', glow: '#1e293b', icon: '🌙' },
      { id: 'fire',   label: 'Feu',         color: '#fdba74', glow: '#431407', icon: '🔥' },
    ],
  },
};

export const LEVELS = {
  easy: {
    label: 'Débutant', emoji: '⭐',
    maxBubbles: 5, spawnMs: 1800, lifetimeMs: 4200,
    pointsHit: 10, pointsMiss: -5, roundSec: 12,
    description: 'Touche les bulles de la bonne couleur',
  },
  hard: {
    label: 'Avancé', emoji: '⚡',
    maxBubbles: 9, spawnMs: 1000, lifetimeMs: 2500,
    pointsHit: 20, pointsMiss: -10, roundSec: 8,
    description: 'Plus de bulles, plus rapide !',
  },
};

export const MAX_LIVES    = 3;
export const ROUNDS_PER_GAME = 5;
