import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test("renders learn react link", () => {
  render(<App />); // App 컴포넌트를 렌더링합니다.
  expect(screen.getByText(/learn react/i)).toBeInTheDocument(); // "learn react" 텍스트가 화면에 렌더링되었는지 확인합니다.
});
