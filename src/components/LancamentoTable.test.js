import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LancamentoTable from './LancamentoTable';

const makeFetchMock = (lancamentos = []) =>
  jest.fn((url) => {
    if (url.includes('/category/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    if (url.includes('/agregacoes/')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            agregacoes: { orcamentoMensal: 1000, totalMes: 200, saldoDisponivel: 800 },
          }),
      });
    }
    if (url.includes('/divisao-grupos/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ grupos: [] }) });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ lancamentos }),
    });
  });

beforeEach(() => {
  global.fetch = makeFetchMock();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const defaultProps = { carteiraId: 1, month: '2026-04', orcamentoMensal: 1000 };

test('renders table headers', async () => {
  render(<LancamentoTable {...defaultProps} />);
  expect(screen.getByText('Data')).toBeInTheDocument();
  expect(screen.getByText('Valor')).toBeInTheDocument();
  expect(screen.getByText('Categoria')).toBeInTheDocument();
  expect(screen.getByText('Ações')).toBeInTheDocument();
});

test('shows "Novo Lançamento" button', async () => {
  render(<LancamentoTable {...defaultProps} />);
  expect(screen.getByText('+ Novo Lançamento')).toBeInTheDocument();
});

test('shows "Nenhum lançamento encontrado" when list is empty', async () => {
  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText('Nenhum lançamento encontrado')).toBeInTheDocument();
  });
});

test('shows agregacoes panel when data is loaded', async () => {
  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText(/Orçamento/)).toBeInTheDocument();
    expect(screen.getByText(/Saldo Disponível/)).toBeInTheDocument();
  });
});

test('clicking "Novo Lançamento" shows inline creation row', () => {
  render(<LancamentoTable {...defaultProps} />);
  fireEvent.click(screen.getByText('+ Novo Lançamento'));
  expect(screen.getByPlaceholderText('Observação')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Valor')).toBeInTheDocument();
});

test('cancels new entry creation when cancel button is clicked', () => {
  render(<LancamentoTable {...defaultProps} />);
  fireEvent.click(screen.getByText('+ Novo Lançamento'));
  // Cancel button is the X icon button (title="Cancelar")
  const cancelButton = screen.getByTitle('Cancelar');
  fireEvent.click(cancelButton);
  expect(screen.getByText('+ Novo Lançamento')).toBeInTheDocument();
});

test('renders lancamentos from API', async () => {
  const lancamento = {
    id: 1,
    data: '2026-04-10T00:00:00.000Z',
    tag: 'Alimentação',
    parcela: null,
    observacao: 'Supermercado',
    nomeNaFatura: null,
    cartao: 'Nubank',
    valor: 150.0,
    conferido: false,
    divisaoGrupoId: null,
    Categoria: { nome: 'Mercado' },
  };
  global.fetch = makeFetchMock([lancamento]);

  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText('Supermercado')).toBeInTheDocument();
    // 'Nubank' appears in both the filter dropdown and the table cell
    expect(screen.getAllByText('Nubank').length).toBeGreaterThanOrEqual(1);
  });
});

test('does not fetch when carteiraId is missing', () => {
  render(<LancamentoTable month="2026-04" orcamentoMensal={0} />);
  expect(global.fetch).not.toHaveBeenCalled();
});
