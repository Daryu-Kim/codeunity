import React, { useRef } from 'react';
import logo from './logo.svg';
import './App.scss';

function App() {
  const body = useRef<HTMLDivElement>(null);
  const themeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ? body.current?.classList.add("dark-theme") : body.current?.classList.remove("dark-theme");
  };
  return (
    <div className="App" ref={body}>
      <header>d</header>
      <div className="asdf">
        <footer>d</footer>
        <div className="content">
          <input type="checkbox" name="" id="theme" className="input" onChange={themeToggle} />
          <label htmlFor='theme' className="user"></label>
          <p className='name fw-1 fs-16 f-code fc-accent'>int main() </p>
        </div>
      </div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
