import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import LoginTest from './pages/Login/InstagramLogin';
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
        <Route path='/logintest' element={<LoginTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
