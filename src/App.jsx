import React from 'react';
import { useGame } from './hooks/useGame';
import GameConfig from './components/GameConfig';
import GameBoard  from './components/GameBoard';
import GameOver   from './components/GameOver';

export default function App() {
  const {
    state, startGame, setConfig, getBest,
    spawnBubble, hitBubble, missBubble, escapeBubble,
    removeFeedback, togglePause, quitToMenu,
  } = useGame();

  return (
    <div style={{ width:'100%', minHeight:'100dvh', display:'flex', flexDirection:'column', background:'#0D0D1A' }} lang="fr">
      <h2 className="sr-only">Popit! — Jeu de mémoire</h2>

      {(state.phase === 'config') && (
        <GameConfig state={state} setConfig={setConfig} startGame={startGame} getBest={getBest} />
      )}
      {(state.phase === 'playing' || state.phase === 'paused') && (
        <GameBoard
          state={state}
          spawnBubble={spawnBubble}
          hitBubble={hitBubble}
          missBubble={missBubble}
          escapeBubble={escapeBubble}
          removeFeedback={removeFeedback}
          togglePause={togglePause}
          quitToMenu={quitToMenu}
        />
      )}
      {state.phase === 'gameover' && (
        <GameOver state={state} onReplay={startGame} onMenu={quitToMenu} getBest={getBest} />
      )}
    </div>
  );
}
