import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MesPage from './MesPage';

// NavbarLogged uses react-bootstrap Offcanvas which calls matchMedia internally,
// not supported in jsdom. Mock it to isolate MesPage logic.
jest.mock('../components/NavbarLogged', () => () => null);

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderMesPage = (month = '2026-04') =>
  render(
    <MemoryRouter initialEntries={[`/mes/${month}`]}>
      <Routes>
        <Route path="/mes/:yyyyMM" element={<MesPage />} />
      </Routes>
    </MemoryRouter>
  );

test('renders month navigation buttons', () => {
  renderMesPage();
  expect(screen.getByTitle('Mês anterior')).toBeInTheDocument();
  expect(screen.getByTitle('Próximo mês')).toBeInTheDocument();
  expect(screen.getByTitle('Ir para hoje')).toBeInTheDocument();
});

// Compute the display string the same way the component does
const getDisplayMonth = (monthStr) => {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }).toUpperCase();
};

test('displays formatted month title', () => {
  renderMesPage('2026-04');
  expect(screen.getByText(getDisplayMonth('2026-04'))).toBeInTheDocument();
});

test('displays orcamento with zero when not loaded', () => {
  renderMesPage();
  expect(screen.getByText(/Orçamento: R\$ 0\.00/)).toBeInTheDocument();
});

test('navigates to previous month on Anterior click', () => {
  renderMesPage('2026-04');
  fireEvent.click(screen.getByTitle('Mês anterior'));
  expect(screen.getByText(getDisplayMonth('2026-03'))).toBeInTheDocument();
});

test('navigates to next month on Próximo click', () => {
  renderMesPage('2026-04');
  fireEvent.click(screen.getByTitle('Próximo mês'));
  expect(screen.getByText(getDisplayMonth('2026-05'))).toBeInTheDocument();
});

test('navigates to current month on Hoje click', () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const expectedTitle = getDisplayMonth(`${year}-${month}`);

  renderMesPage('2025-01');
  fireEvent.click(screen.getByTitle('Ir para hoje'));
  expect(screen.getByText(expectedTitle)).toBeInTheDocument();
});

test('does not render LancamentoTable when walletId is not set', () => {
  // fetch returns 404 so walletId stays null
  renderMesPage();
  // The table container should not be present without a walletId
  expect(screen.queryByText('+ Novo Lançamento')).not.toBeInTheDocument();
});
