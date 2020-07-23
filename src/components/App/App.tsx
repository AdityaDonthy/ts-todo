import React from 'react';
import './App.css';
import Recorder from '../Recorder/Recorder';
import Calendar from './../Calendar/Calendar'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Recorder />
        <Calendar />
      </header>
    </div>
  );
}

export default App;
