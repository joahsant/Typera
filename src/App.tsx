import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Studio from './modes/Studio';
import Preview from './modes/Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Studio />} />
        <Route path="/preview" element={<Preview />} />
        {/* Adicionar rotas para Forge e Academy na V2 */}
      </Routes>
    </Router>
  );
}

export default App;
