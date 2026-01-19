import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function RouterTest() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </BrowserRouter>
  );
}
