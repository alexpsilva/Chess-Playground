import { Board } from './components/Board';

function App() {
  return (
    <div className="App">
      <Board pieces={[
        {'row': '1', 'col': 'g', 'type': 'pawn', 'color': 'white'}
      ]}/>
    </div>
  );
}

export default App;
