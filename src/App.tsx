import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import './App.module.scss';

function App() {
  const body = useRef<HTMLDivElement>(null);
  const themeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? body.current?.classList.add("dark-theme") : body.current?.classList.remove("dark-theme");
  };
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element= */}
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
