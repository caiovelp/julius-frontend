import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LancamentoTable from './LancamentoTable';

const makeFetchMock = (lancamentos = []) =>
  jest.fn((url) => {
    if (url.includes('/category/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1, nome: 'Alimentação e Bebida' }]),
      });
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
  await waitFor(() => {
    expect(screen.getByText('+ Nova linha')).toBeInTheDocument();
  });
  expect(screen.getByText('DATA')).toBeInTheDocument();
  expect(screen.getByText('VALOR')).toBeInTheDocument();
  expect(screen.getByText('CATEGORIA')).toBeInTheDocument();
});

test('shows "+ Nova linha" button when categories exist', async () => {
  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText('+ Nova linha')).toBeInTheDocument();
  });
});

test('shows "Nenhum lançamento encontrado" when list is empty', async () => {
  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText('Nenhum lançamento. Clique em "+ Nova linha" para começar.')).toBeInTheDocument();
  });
});

test('clicking "+ Nova linha" shows inline creation row', async () => {
  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText('+ Nova linha')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('+ Nova linha'));
  expect(screen.getByPlaceholderText('Observação')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('0,00')).toBeInTheDocument();
});

test('cancels new entry creation when cancel button is clicked', async () => {
  render(<LancamentoTable {...defaultProps} />);
  await waitFor(() => {
    expect(screen.getByText('+ Nova linha')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('+ Nova linha'));
  // Cancel button is the X icon button (title="Cancelar")
  const cancelButton = screen.getByTitle('Cancelar');
  fireEvent.click(cancelButton);
  expect(screen.getByText('+ Nova linha')).toBeInTheDocument();
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
