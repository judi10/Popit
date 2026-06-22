export const THEMES = {
  colors: {
    name: 'Couleurs', emoji: '🎨', mode: 'color',
    items: [
      { id: 'red',    label: 'Rouge',  color: '#ef4444', glow: '#991b1b', icon: null },
      { id: 'blue',   label: 'Bleu',   color: '#3b82f6', glow: '#1e40af', icon: null },
      { id: 'green',  label: 'Vert',   color: '#22c55e', glow: '#166534', icon: null },
      { id: 'yellow', label: 'Jaune',  color: '#eab308', glow: '#854d0e', icon: null },
      { id: 'purple', label: 'Violet', color: '#a855f7', glow: '#6b21a8', icon: null },
      { id: 'orange', label: 'Orange', color: '#f97316', glow: '#9a3412', icon: null },
    ],
  },
  animals: {
    name: 'Animaux', emoji: '🐾', mode: 'color',
    items: [
      { id: 'dog',     label: 'Chien',      color: '#f97316', glow: '#9a3412', icon: null },
      { id: 'cat',     label: 'Chat',       color: '#a855f7', glow: '#6b21a8', icon: null },
      { id: 'frog',    label: 'Grenouille', color: '#22c55e', glow: '#166534', icon: null },
      { id: 'fox',     label: 'Renard',     color: '#ef4444', glow: '#991b1b', icon: null },
      { id: 'penguin', label: 'Pingouin',   color: '#38bdf8', glow: '#0369a1', icon: null },
      { id: 'wolf',    label: 'Loup',       color: '#94a3b8', glow: '#334155', icon: null },
    ],
  },
  nature: {
    name: 'Nature', emoji: '🌿', mode: 'icon',
    items: [
      { id: 'flower', label: 'Fleur',      color: '#ec4899', glow: '#9d174d', icon: '🌸' },
      { id: 'wave',   label: 'Vague',      color: '#3b82f6', glow: '#1e40af', icon: '🌊' },
      { id: 'shroom', label: 'Champignon', color: '#ef4444', glow: '#991b1b', icon: '🍄' },
      { id: 'star',   label: 'Étoile',     color: '#eab308', glow: '#854d0e', icon: '⭐' },
      { id: 'moon',   label: 'Lune',       color: '#94a3b8', glow: '#334155', icon: '🌙' },
      { id: 'fire',   label: 'Feu',        color: '#f97316', glow: '#9a3412', icon: '🔥' },
    ],
  },
};

export const LEVELS = {
  easy: {
    label: 'Débutant', emoji: '⭐',
    lives: 3,
    maxBubbles: 7, spawnMs: 1400, lifetimeMs: 4500,
    pointsHit: 10, pointsMiss: -5,
    description: 'Touche les bulles de la bonne couleur',
    showBest: true,
  },
  hard: {
    label: 'Avancé', emoji: '⚡',
    lives: 2,
    maxBubbles: 8, spawnMs: 1400, lifetimeMs: 3800,
    pointsHit: 20, pointsMiss: -10,
    description: 'Touche le bon objet',
    showBest: true,
  },
};