import React from 'react';
import Game from './features/game/game';
import { restart } from './features/game/slice';
import { useAppDispatch } from './redux';

function App() {
  const dispatch = useAppDispatch()
  return (
    <div className="App" style={{width: '500px', height: '500px'}}>
      <Game/>
      <button onClick={() => dispatch(restart())}>Restart</button>
    </div>
  );
}

export default App;
