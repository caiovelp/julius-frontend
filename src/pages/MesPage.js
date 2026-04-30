import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlusLg } from 'react-bootstrap-icons';
import LancamentoTable from '../components/LancamentoTable';
import '../styles/MesPage.css';

const PALETTE = [
  '#ef4444', '#8b5cf6', '#22c55e', '#06b6d4', '#ec4899',
  '#f97316', '#eab308', '#14b8a6', '#3b82f6', '#a855f7', '#84cc16', '#f43f5e',
];

const colorForKey = (key = '') => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

const formatBRL = (v) =>
  (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const MesPage = () => {
  const { yyyyMM } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [walletId, setWalletId] = useState(null);
  const [orcamentoMensal, setOrcamentoMensal] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(yyyyMM);
  const [lancamentos, setLancamentos] = useState([]);
  const tableRef = useRef(null);

  const parseMonth = (s) => {
    const [y, m] = s.split('-').map(Number);
    return new Date(y, m - 1, 1);
  };

  const formatMonth = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

  const getMonthLabel = (s) => {
    const d = parseMonth(s);
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const tabMonths = useMemo(() => {
    const c = parseMonth(currentMonth);
    return [-2, -1, 0, 1, 2].map((i) => {
      const d = new Date(c.getFullYear(), c.getMonth() + i, 1);
      return formatMonth(d);
    });
  }, [currentMonth]);

  const agg = useMemo(() => {
    const expenses = lancamentos.filter((l) => l.valor > 0);
    const income = lancamentos.filter((l) => l.valor < 0);
    const totalExpenses = expenses.reduce((s, l) => s + l.valor, 0);
    const totalIncome = income.reduce((s, l) => s + Math.abs(l.valor), 0);
    const conferidos = expenses.filter((l) => l.conferido).length;

    const groupSum = (arr, keyFn) => {
      const map = {};
      arr.forEach((l) => {
        const k = keyFn(l);
        map[k] = (map[k] || 0) + l.valor;
      });
      return Object.entries(map).sort((a, b) => b[1] - a[1]);
    };

    const tagMap = {};
    lancamentos.forEach((l) => {
      if (!l.tag) return;
      tagMap[l.tag] = (tagMap[l.tag] || 0) + Math.abs(l.valor);
    });
    const porTag = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return {
      totalExpenses,
      totalIncome,
      saldo: totalIncome - totalExpenses,
      conferidos,
      total: lancamentos.length,
      porCartao: groupSum(expenses, (l) => l.cartao || 'Sem cartão'),
      porCategoria: groupSum(expenses, (l) => l.Categoria?.nome || 'Sem categoria'),
      porTag,
      tagTotal: porTag.reduce((s, [, v]) => s + v, 0),
    };
  }, [lancamentos]);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);
      fetch(`http://localhost:3000/users/getUserById/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && setUsername(d.username))
        .catch(() => {});
      fetch(`http://localhost:3000/wallets/getCarteiraByUserId/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d) {
            setWalletId(d.id);
            setOrcamentoMensal(d.orcamentoMensal || 0);
          }
        })
        .catch(() => {});
    }
  }, []);

  const goToMonth = (m) => {
    setCurrentMonth(m);
    navigate(`/mes/${m}`);
  };

  const prevMonth = () => {
    const d = parseMonth(currentMonth);
    d.setMonth(d.getMonth() - 1);
    goToMonth(formatMonth(d));
  };

  const nextMonth = () => {
    const d = parseMonth(currentMonth);
    d.setMonth(d.getMonth() + 1);
    goToMonth(formatMonth(d));
  };

  const AggList = ({ items, total }) => (
    <div className="agg-list">
      {items.map(([key, val]) => (
        <div key={key} className="agg-item">
          <div className="agg-item-info">
            <span className="agg-dot" style={{ background: colorForKey(key) }} />
            <span className="agg-name">{key}</span>
            <span className="agg-val">R$ {formatBRL(val)}</span>
          </div>
          <div className="agg-track">
            <div
              className="agg-fill"
              style={{
                width: `${Math.min(100, (val / (total || 1)) * 100)}%`,
                background: colorForKey(key),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mes-page">

        {/* Top bar with branding + new button */}
        <div className="mes-topbar">
          <div className="mes-brand">
            <div className="mes-brand-icon">F</div>
            <div>
              <div className="mes-brand-title">Folha</div>
              <div className="mes-brand-sub">Sua planilha de finanças, sem planilha.</div>
            </div>
          </div>
          <button className="btn-novo-lancamento" onClick={() => tableRef.current?.startNewEntry()}>
            <PlusLg size={14} /> Novo lançamento
          </button>
        </div>

        {/* Month tabs */}
        <div className="month-nav">
          <button className="month-arrow" onClick={prevMonth}>
            <ChevronLeft />
          </button>
          <div className="month-tabs">
            {tabMonths.map((m) => (
              <button
                key={m}
                className={`month-tab${m === currentMonth ? ' active' : ''}`}
                onClick={() => goToMonth(m)}
              >
                {getMonthLabel(m)}
              </button>
            ))}
          </div>
          <button className="month-arrow" onClick={nextMonth}>
            <ChevronRight />
          </button>
        </div>

        {/* Summary cards */}
        <div className="summary-grid">
          <div className="summary-card summary-saldo">
            <div className="summary-label">
              SALDO DISPONÍVEL • {getMonthLabel(currentMonth).toUpperCase()}
            </div>
            <div className="summary-big saldo-color">R$ {formatBRL(agg.saldo)}</div>
            <div className="summary-hint">
              R$ {formatBRL(agg.totalIncome)} receitas – R$ {formatBRL(agg.totalExpenses)} despesas
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">RECEITAS</div>
            <div className="summary-big receita-color">R$ {formatBRL(agg.totalIncome)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">DESPESAS</div>
            <div className="summary-big despesa-color">R$ {formatBRL(agg.totalExpenses)}</div>
            <div className="summary-hint">{agg.conferidos}/{agg.total} conferidos</div>
          </div>
        </div>

        {/* Aggregation charts */}
        {lancamentos.length > 0 && (
          <div className="agg-grid">
            <div className="agg-card">
              <div className="agg-header">
                <span>Por cartão</span>
                <span className="agg-header-total">R$ {formatBRL(agg.totalExpenses)}</span>
              </div>
              <AggList items={agg.porCartao} total={agg.totalExpenses} />
            </div>
            <div className="agg-card">
              <div className="agg-header">
                <span>Por categoria</span>
                <span className="agg-header-total">R$ {formatBRL(agg.totalExpenses)}</span>
              </div>
              <AggList items={agg.porCategoria} total={agg.totalExpenses} />
            </div>
            <div className="agg-card">
              <div className="agg-header">
                <span>Por tag (top 8)</span>
                <span className="agg-header-total">R$ {formatBRL(agg.tagTotal)}</span>
              </div>
              <AggList items={agg.porTag} total={agg.tagTotal} />
            </div>
          </div>
        )}

        {/* Lancamentos table */}
        <LancamentoTable
          ref={tableRef}
          carteiraId={walletId}
          month={currentMonth}
          orcamentoMensal={orcamentoMensal}
          onLancamentosChange={setLancamentos}
        />
      </div>
  );
};

export default MesPage;
