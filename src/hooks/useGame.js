import { useReducer, useEffect, useRef, useCallback } from 'react';
import { LEVELS, THEMES } from '../constants';

let _bid = 0;
let _fid = 0;

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function makeBubble(theme, areaW, areaH) {
  const item = pickRandom(THEMES[theme].items);
  const size = 56 + Math.floor(Math.random() * 28); /* légèrement plus grand = plus facile à cliquer */
  return {
    id: ++_bid,
    item,
    size,
    x: Math.random() * (areaW - size - 20) + 10,
    startY: areaH + size,
    drift: (Math.random() - 0.5) * 40,
  };
}

const initial = {
  phase: 'config',   /* 'config' | 'playing' | 'paused' | 'gameover' */
  theme: 'colors',
  level: 'easy',
  score: 0,
  lives: 3,
  target: null,
  bubbles: [],
  feedbacks: [],
};

function pickNewTarget(theme, current) {
  /* évite de répéter la même cible deux fois de suite */
  const items = THEMES[theme].items;
  if (items.length <= 1) return items[0];
  let next;
  do { next = pickRandom(items); } while (next.id === current?.id);
  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, [action.key]: action.value };

    case 'START_GAME': {
      const lvl = LEVELS[state.level];
      const target = pickRandom(THEMES[state.theme].items);
      return {
        ...initial,
        phase: 'playing',
        theme: state.theme,
        level: state.level,
        lives: lvl.lives,
        target,
        bubbles: [],
        feedbacks: [],
      };
    }

    case 'SPAWN_BUBBLE':
      return { ...state, bubbles: [...state.bubbles, action.bubble] };

    case 'HIT': {
      const pts = LEVELS[state.level].pointsHit;
      /* change target after every hit */
      const newTarget = pickNewTarget(state.theme, state.target);
      return {
        ...state,
        score: state.score + pts,
        target: newTarget,
        bubbles: state.bubbles.filter(b => b.id !== action.id),
        feedbacks: [...state.feedbacks, { id: ++_fid, text: `+${pts}`, type: 'success', x: action.x, y: action.y }],
      };
    }

    case 'MISS': {
      const pen = LEVELS[state.level].pointsMiss;
      const newLives = state.lives - 1;
      return {
        ...state,
        score: Math.max(0, state.score + pen),
        lives: newLives,
        bubbles: state.bubbles.filter(b => b.id !== action.id),
        feedbacks: [...state.feedbacks, { id: ++_fid, text: '✗', type: 'danger', x: action.x, y: action.y }],
        phase: newLives <= 0 ? 'gameover' : state.phase,
      };
    }

    case 'BUBBLE_ESCAPED': {
      if (!action.isTarget) return { ...state, bubbles: state.bubbles.filter(b => b.id !== action.id) };
      const newLives = state.lives - 1;
      return {
        ...state,
        lives: newLives,
        bubbles: state.bubbles.filter(b => b.id !== action.id),
        phase: newLives <= 0 ? 'gameover' : state.phase,
      };
    }

    case 'TOGGLE_PAUSE':
      if (state.phase === 'playing') return { ...state, phase: 'paused' };
      if (state.phase === 'paused')  return { ...state, phase: 'playing' };
      return state;

    case 'QUIT_TO_MENU':
      return { ...initial, theme: state.theme, level: state.level };

    case 'REMOVE_FEEDBACK':
      return { ...state, feedbacks: state.feedbacks.filter(f => f.id !== action.id) };

    default: return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial);

    /* Sauvegarde le meilleur score à la fin de la partie */
  useEffect(() => {
    if (state.phase !== 'gameover') return;
    try {
      const cle = `popit_best_${state.level}`;
      const precedent = parseInt(localStorage.getItem(cle) || '0', 10);
      if (state.score > precedent) localStorage.setItem(cle, state.score);
    } catch (_) {}
  }, [state.phase]);

  const getBest = useCallback((level) => {
    try { return parseInt(localStorage.getItem(`popit_best_${level}`) || '0', 10); }
    catch (_) { return 0; }
  }, []);

  return {
    state,
    startGame:      useCallback(() => dispatch({ type: 'START_GAME' }), []),
    setConfig:      useCallback((k, v) => dispatch({ type: 'SET_CONFIG', key: k, value: v }), []),
    spawnBubble:    useCallback((b) => dispatch({ type: 'SPAWN_BUBBLE', bubble: b }), []),
    hitBubble:      useCallback((id, x, y) => dispatch({ type: 'HIT', id, x, y }), []),
    missBubble:     useCallback((id, x, y) => dispatch({ type: 'MISS', id, x, y }), []),
    escapeBubble:   useCallback((id, isTarget) => dispatch({ type: 'BUBBLE_ESCAPED', id, isTarget }), []),
    removeFeedback: useCallback((id) => dispatch({ type: 'REMOVE_FEEDBACK', id }), []),
    togglePause:    useCallback(() => dispatch({ type: 'TOGGLE_PAUSE' }), []),
    quitToMenu:     useCallback(() => dispatch({ type: 'QUIT_TO_MENU' }), []),
    getBest,
  };
}
