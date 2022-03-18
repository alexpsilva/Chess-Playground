import React from 'react';
import { Game } from './components/functional/game';
import { PieceColor, PieceType } from './entities/enums';
import BoardPosition from './features/board-position/board-position';

function App() {
  return (
    <div className="App" style={{width: '500px', height: '500px'}}>
      <BoardPosition/>
    </div>
  );
}

export default App;
