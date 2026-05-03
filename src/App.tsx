import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Studio from './modes/Studio';
import Preview from './modes/Preview';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0D0D0D', color: '#C8FF00', overflow: 'auto' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Studio />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/test" element={<div>Test Page</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
