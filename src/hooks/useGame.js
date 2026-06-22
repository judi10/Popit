import { useReducer, useEffect, useRef, useCallback } from 'react';
import { LEVELS, THEMES, MAX_LIVES, ROUNDS_PER_GAME } from '../constants';

let _bid = 0;
let _fid = 0;

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function makeBubble(theme, areaW, areaH) {
  const item = pickRandom(THEMES[theme].items);
  const size = 52 + Math.floor(Math.random() * 28);
  return {
    id: ++_bid,
    item,
    size,
    x: Math.random() * (areaW - size - 20) + 10,
    startY: areaH + size,
    drift: (Math.random() - 0.5) * 50,
  };
}

const initial = {
  phase: 'config',
  theme: 'colors',
  level: 'easy',
  score: 0,
  lives: MAX_LIVES,
  round: 0,
  roundTimeLeft: 0,
  target: null,
  bubbles: [],
  feedbacks: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, [action.key]: action.value };

    case 'START_GAME': {
      const target = pickRandom(THEMES[state.theme].items);
      return {
        ...initial,
        phase: 'playing',
        theme: state.theme,
        level: state.level,
        lives: MAX_LIVES,
        roundTimeLeft: LEVELS[state.level].roundSec,
        target,
      };
    }

    case 'SPAWN_BUBBLE':
      return { ...state, bubbles: [...state.bubbles, action.bubble] };

    case 'HIT': {
      const pts = LEVELS[state.level].pointsHit;
      return {
        ...state,
        score: state.score + pts,
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
      const newLives = action.isTarget ? state.lives - 1 : state.lives;
      return {
        ...state,
        lives: newLives,
        bubbles: state.bubbles.filter(b => b.id !== action.id),
        phase: newLives <= 0 ? 'gameover' : state.phase,
      };
    }

    case 'TICK_ROUND': {
      if (state.phase !== 'playing') return state;
      const newTime = state.roundTimeLeft - 1;
      if (newTime <= 0) {
        const nextRound = state.round + 1;
        if (nextRound >= ROUNDS_PER_GAME) return { ...state, roundTimeLeft: 0, phase: 'gameover' };
        return {
          ...state,
          round: nextRound,
          roundTimeLeft: LEVELS[state.level].roundSec,
          target: pickRandom(THEMES[state.theme].items),
          bubbles: [],
        };
      }
      return { ...state, roundTimeLeft: newTime };
    }

    case 'REMOVE_FEEDBACK':
      return { ...state, feedbacks: state.feedbacks.filter(f => f.id !== action.id) };

    default: return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial);
  const roundTimer = useRef(null);

  useEffect(() => {
    if (state.phase !== 'playing') { clearInterval(roundTimer.current); return; }
    roundTimer.current = setInterval(() => dispatch({ type: 'TICK_ROUND' }), 1000);
    return () => clearInterval(roundTimer.current);
  }, [state.phase, state.round]);

  useEffect(() => {
    if (state.phase !== 'gameover') return;
    try {
      const key = `bubblepop_best_${state.level}`;
      const prev = parseInt(localStorage.getItem(key) || '0', 10);
      if (state.score > prev) localStorage.setItem(key, state.score);
    } catch (_) {}
  }, [state.phase]);

  const getBest = useCallback((level) => {
    try { return parseInt(localStorage.getItem(`bubblepop_best_${level}`) || '0', 10); }
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
    getBest,
  };
}
