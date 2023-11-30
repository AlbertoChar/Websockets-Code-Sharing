import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LobbyPage from './components/Lobby.js';
import CodeBlockDetails from './components/CodeBlock.js';
import backgroundImage from '../src/assets/background.png';
import NavBar from './components/navBar.js'; // Import the NavBar component

import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
        <NavBar />
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/code-block/:id" element={<CodeBlockDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
