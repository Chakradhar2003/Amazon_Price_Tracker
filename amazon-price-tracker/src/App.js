import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Graph from './Graph';
import HomePage from './HomePage'; // assuming you have a HomePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<Graph />} />
      </Routes>
    </Router>
  );
}

export default App;
