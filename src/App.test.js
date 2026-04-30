import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// NavbarLogged uses react-bootstrap Offcanvas which calls matchMedia internally,
// not supported in jsdom. Mock it to isolate App routing logic.
jest.mock('./components/NavbarLogged', () => () => null);

// Mock fetch for any API calls triggered by child components
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders without crashing', () => {
  render(<App />);
});

test('redirects root to current month navigation buttons', () => {
  render(<App />);
  // After redirect to /mes/:yyyyMM, MesPage renders navigation buttons
  expect(document.querySelector('button[title="Mês anterior"]')).toBeInTheDocument();
  expect(document.querySelector('button[title="Próximo mês"]')).toBeInTheDocument();
});
