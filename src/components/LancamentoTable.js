import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { Pencil, Trash3, Check, X, CheckCircleFill, Circle, Calendar3 } from 'react-bootstrap-icons';
import '../styles/LancamentoTable.css';

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

const PERSONAL_TAGS = ['Caio', 'Casal', 'Mylena'];

const DEFAULT_CATEGORIES = [
  'Alimentação e Bebida', 'Bela', 'Conta', 'Economias',
  'Entretenimento', 'Fixo', 'Higiene e Saúde', 'Outros', 'Transporte', 'Terceiros',
];

const parseDate = (dateStr) => {
  if (!dateStr) return '';
  const d = dateStr.split('T')[0];
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};

const LancamentoTable = forwardRef(({
  carteiraId,
  month,
  orcamentoMensal = 0,
  onLancamentosChange,
}, ref) => {
  const [lancamentos, setLancamentos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [creatingNew, setCreatingNew] = useState(false);
  const [newLancamento, setNewLancamento] = useState({});
  const [gruposDiv, setGruposDiv] = useState([]);
  const [showCreateGrupo, setShowCreateGrupo] = useState(false);
  const [novoGrupo, setNovoGrupo] = useState({});
  const [filters, setFilters] = useState({
    tag: '',
    cartao: '',
    categoria: '',
    conferido: '',
    search: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLancamentos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        month,
        ...(filters.tag && { tag: filters.tag }),
        ...(filters.cartao && { cartao: filters.cartao }),
        ...(filters.categoria && { categoria: filters.categoria }),
        ...(filters.conferido && { conferido: filters.conferido }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(
        `http://localhost:3000/lancamentos/mes/${carteiraId}?${params}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        const list = data.lancamentos || [];
        setLancamentos(list);
        if (onLancamentosChange) onLancamentosChange(list);
      }
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/category/getCategorias`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        setCategorias(Array.isArray(data) ? data : data.categorias || []);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchGrupos = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/divisao-grupos/carteira/${carteiraId}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );

      if (response.ok) {
        const data = await response.json();
        setGruposDiv(data.grupos || []);
      }
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
    }
  };

  useEffect(() => {
    if (carteiraId && month) {
      fetchLancamentos();
      fetchCategorias();
      fetchGrupos();
    }
  }, [carteiraId, month]);

  useEffect(() => {
    if (carteiraId && month) {
      fetchLancamentos();
    }
  }, [filters]);

  const startEdit = (lancamento) => {
    setEditingId(lancamento.id);
    setEditValues({ ...lancamento });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/lancamentos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editValues),
      });

      if (response.ok) {
        setEditingId(null);
        setEditValues({});
        fetchLancamentos();
      }
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
    }
  };

  const deleteLancamento = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este lançamento?')) return;
    try {
      const response = await fetch(`http://localhost:3000/lancamentos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) fetchLancamentos();
    } catch (error) {
      console.error('Erro ao deletar lançamento:', error);
    }
  };

  const toggleConferido = async (lancamento) => {
    try {
      const response = await fetch(`http://localhost:3000/lancamentos/${lancamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conferido: !lancamento.conferido }),
      });

      if (response.ok) fetchLancamentos();
    } catch (error) {
      console.error('Erro ao atualizar conferido:', error);
    }
  };

  const startNewEntry = () => {
    if (creatingNew) return;
    const today = new Date().toISOString().split('T')[0];
    setCreatingNew(true);
    setNewLancamento({ data: today, conferido: false });
    setTimeout(() => {
      const el = document.querySelector('.new-row-date');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        el.focus();
      }
    }, 50);
  };

  const cancelNewEntry = () => {
    setCreatingNew(false);
    setNewLancamento({});
  };

  // Aplica a regra: tag fora das pessoais → categoria Terceiros
  const handleNewTag = (tag) => {
    const updates = { tag };
    if (tag && !PERSONAL_TAGS.includes(tag)) {
      const terceiros = categorias.find((c) => c.nome === 'Terceiros');
      if (terceiros) updates.categoriaId = String(terceiros.id);
    }
    setNewLancamento((prev) => ({ ...prev, ...updates }));
  };

  const saveNewLancamento = async () => {
    if (!newLancamento.data || newLancamento.valor === undefined || newLancamento.valor === '') {
      alert('Data e Valor são obrigatórios');
      return;
    }
    if (categorias.length > 0 && !newLancamento.categoriaId) {
      alert('Categoria é obrigatória');
      return;
    }

    try {
      const payload = {
        ...newLancamento,
        valor: parseFloat(newLancamento.valor),
        categoriaId: newLancamento.categoriaId ? newLancamento.categoriaId : undefined,
      };

      const response = await fetch(`http://localhost:3000/lancamentos/${carteiraId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setCreatingNew(false);
        setNewLancamento({});
        fetchLancamentos();
      } else {
        const error = await response.json();
        alert('Erro ao criar lançamento: ' + (error.error || error.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao salvar novo lançamento:', error);
      alert('Erro ao criar lançamento');
    }
  };

  const saveNewGrupo = async () => {
    if (!novoGrupo.valorOriginal) {
      alert('Valor original é obrigatório');
      return;
    }
    try {
      const payload = {
        valorOriginal: parseFloat(novoGrupo.valorOriginal),
        numParcelas: novoGrupo.numParcelas ? parseInt(novoGrupo.numParcelas) : null,
        descricao: novoGrupo.descricao || null,
      };

      const response = await fetch(`http://localhost:3000/divisao-grupos/${carteiraId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowCreateGrupo(false);
        setNovoGrupo({});
        fetchGrupos();
      } else {
        const error = await response.json();
        alert('Erro ao criar grupo: ' + (error.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao salvar novo grupo:', error);
    }
  };

  const vincularAoGrupo = async (lancamentoId, grupoId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/divisao-grupos/${grupoId}/vincular/${lancamentoId}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      if (response.ok) {
        fetchLancamentos();
        fetchGrupos();
      }
    } catch (error) {
      console.error('Erro ao vincular lançamento:', error);
    }
  };

  const desvincularDoGrupo = async (lancamentoId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/divisao-grupos/desvincular/${lancamentoId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      );
      if (response.ok) {
        fetchLancamentos();
        fetchGrupos();
      }
    } catch (error) {
      console.error('Erro ao desvincular lançamento:', error);
    }
  };

  useImperativeHandle(ref, () => ({ startNewEntry }));

  const uniqueTags = [...new Set(lancamentos.map((l) => l.tag).filter(Boolean))];
  const uniqueCartoes = [...new Set(lancamentos.map((l) => l.cartao).filter(Boolean))];

  return (
    <div className="lancamento-section">

      {/* Section header */}
      <div className="section-title-row">
        <div>
          <h2 className="section-title">Lançamentos</h2>
          <p className="section-subtitle">
            Mostrando {lancamentos.length} de {lancamentos.length}
            {lancamentos.some((l) => l.divisaoGrupoId) && ' • barra colorida indica grupo de divisão'}
          </p>
        </div>
        <button
          className="btn-criar-grupo"
          onClick={() => setShowCreateGrupo(true)}
          title="Criar grupo de divisão"
        >
          + Grupo de divisão
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-search-wrap">
          <span className="filter-search-icon">🔍</span>
          <input
            className="filter-search"
            placeholder="Buscar por nome, observação, tag..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-selects-row">
          <select
            className="filter-select"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="">Todas as tags</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.cartao}
            onChange={(e) => setFilters({ ...filters, cartao: e.target.value })}
          >
            <option value="">Todos os cartões</option>
            {uniqueCartoes.map((cartao) => (
              <option key={cartao} value={cartao}>{cartao}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.categoria}
            onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.conferido}
            onChange={(e) => setFilters({ ...filters, conferido: e.target.value })}
          >
            <option value="">Conferido: todo</option>
            <option value="true">Conferidos</option>
            <option value="false">Não conferidos</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="tabela-wrapper">
        <table className="lancamento-table">
          <thead>
            <tr>
              <th>DATA</th>
              <th>TAG</th>
              <th>PARCELA</th>
              <th>OBSERVAÇÃO</th>
              <th>NOME NA FATURA</th>
              <th>CARTÃO</th>
              <th>CATEGORIA</th>
              <th>VALOR</th>
              <th>CONF.</th>
              <th>DIVISÃO</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.length === 0 && !creatingNew && (
              <tr>
                <td colSpan="11" className="empty-table-row">
                  {categorias.length === 0
                    ? 'Inicialize as categorias antes de criar lançamentos.'
                    : 'Nenhum lançamento. Clique em "+ Nova linha" para começar.'}
                </td>
              </tr>
            )}

            {/* Existing lancamentos */}
            {lancamentos.map((lancamento) => {
              const grupo = lancamento.divisaoGrupoId
                ? gruposDiv.find((g) => g.id === lancamento.divisaoGrupoId)
                : null;
              const grupoColor = grupo ? colorForKey(String(lancamento.divisaoGrupoId)) : null;

              return editingId === lancamento.id ? (
                <tr key={lancamento.id} className="row-editing">
                  <td>
                    <input
                      type="date"
                      value={editValues.data ? editValues.data.split('T')[0] : ''}
                      onChange={(e) => setEditValues({ ...editValues, data: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editValues.tag || ''}
                      onChange={(e) => setEditValues({ ...editValues, tag: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="n/x"
                      value={editValues.parcela || ''}
                      onChange={(e) => setEditValues({ ...editValues, parcela: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editValues.observacao || ''}
                      onChange={(e) => setEditValues({ ...editValues, observacao: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editValues.nomeNaFatura || ''}
                      onChange={(e) => setEditValues({ ...editValues, nomeNaFatura: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editValues.cartao || ''}
                      onChange={(e) => setEditValues({ ...editValues, cartao: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      value={editValues.categoriaId || ''}
                      onChange={(e) => setEditValues({ ...editValues, categoriaId: e.target.value })}
                    >
                      <option value="">Selecionar</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.valor || ''}
                      onChange={(e) => setEditValues({ ...editValues, valor: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editValues.conferido || false}
                      onChange={(e) => setEditValues({ ...editValues, conferido: e.target.checked })}
                    />
                  </td>
                  <td>
                    <select
                      value={editValues.divisaoGrupoId || ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          vincularAoGrupo(lancamento.id, e.target.value);
                        } else {
                          desvincularDoGrupo(lancamento.id);
                        }
                      }}
                    >
                      <option value="">Sem grupo</option>
                      {gruposDiv.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.descricao || `R$ ${formatBRL(g.valorOriginal)}`}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="col-acoes">
                    <button className="btn-icon btn-save" onClick={saveEdit} title="Salvar">
                      <Check size={14} />
                    </button>
                    <button className="btn-icon btn-cancel" onClick={cancelEdit} title="Cancelar">
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ) : (
                <tr
                  key={lancamento.id}
                  className="row-normal"
                  style={grupoColor ? { borderLeft: `3px solid ${grupoColor}` } : {}}
                >
                  <td className="col-data">
                    {parseDate(lancamento.data)}
                    <Calendar3 size={11} className="date-icon" />
                  </td>
                  <td className="col-tag">{lancamento.tag || '–'}</td>
                  <td className="col-parcela">{lancamento.parcela || '–'}</td>
                  <td className="col-obs">{lancamento.observacao || '—'}</td>
                  <td className="col-fatura">{lancamento.nomeNaFatura || '–'}</td>
                  <td className="col-cartao">
                    {lancamento.cartao && (
                      <span className="cell-dot" style={{ background: colorForKey(lancamento.cartao) }} />
                    )}
                    {lancamento.cartao || '–'}
                  </td>
                  <td className="col-categoria">
                    {lancamento.Categoria?.nome && (
                      <span className="cell-dot" style={{ background: colorForKey(lancamento.Categoria.nome) }} />
                    )}
                    {lancamento.Categoria?.nome || '–'}
                  </td>
                  <td className={`col-valor ${lancamento.valor < 0 ? 'valor-receita' : 'valor-despesa'}`}>
                    {lancamento.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="col-conf">
                    <button className="conf-toggle" onClick={() => toggleConferido(lancamento)}>
                      {lancamento.conferido
                        ? <CheckCircleFill className="conf-on" />
                        : <Circle className="conf-off" />
                      }
                    </button>
                  </td>
                  <td className="col-divisao">
                    {grupo ? (
                      <span className="divisao-tag" style={{ borderColor: grupoColor }}>
                        R$ {formatBRL(grupo.valorOriginal)}
                      </span>
                    ) : '–'}
                  </td>
                  <td className="col-acoes">
                    <button className="btn-icon btn-edit" onClick={() => startEdit(lancamento)} title="Editar">
                      <Pencil size={13} />
                    </button>
                    <button className="btn-icon btn-delete" onClick={() => deleteLancamento(lancamento.id)} title="Deletar">
                      <Trash3 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {/* New lancamento row — always at the bottom */}
            {creatingNew && (
              <tr className="row-editing row-new">
                <td>
                  <input
                    className="new-row-date"
                    type="date"
                    value={newLancamento.data || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, data: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Tag"
                    value={newLancamento.tag || ''}
                    onChange={(e) => handleNewTag(e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="n/x"
                    value={newLancamento.parcela || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, parcela: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Observação"
                    value={newLancamento.observacao || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, observacao: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Nome na fatura"
                    value={newLancamento.nomeNaFatura || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, nomeNaFatura: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Cartão"
                    value={newLancamento.cartao || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, cartao: e.target.value })}
                  />
                </td>
                <td>
                  <select
                    value={newLancamento.categoriaId || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, categoriaId: e.target.value })}
                  >
                    <option value="">Selecionar</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newLancamento.valor || ''}
                    onChange={(e) => setNewLancamento({ ...newLancamento, valor: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={newLancamento.conferido || false}
                    onChange={(e) => setNewLancamento({ ...newLancamento, conferido: e.target.checked })}
                  />
                </td>
                <td>—</td>
                <td className="col-acoes">
                  <button className="btn-icon btn-save" onClick={saveNewLancamento} title="Salvar">
                    <Check size={14} />
                  </button>
                  <button className="btn-icon btn-cancel" onClick={cancelNewEntry} title="Cancelar">
                    <X size={14} />
                  </button>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div className="table-footer">
        <span className="table-count">
          {loading ? 'Carregando...' : `${lancamentos.length} linha(s)`}
        </span>
        <div className="table-footer-actions">
          {!creatingNew && (
            <button className="btn-nova-linha" onClick={startNewEntry}>
              + Nova linha
            </button>
          )}
        </div>
      </div>

      {/* Modal criar grupo */}
      <Modal show={showCreateGrupo} onHide={() => setShowCreateGrupo(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Criar Grupo de Divisão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Valor Original</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={novoGrupo.valorOriginal || ''}
              onChange={(e) => setNovoGrupo({ ...novoGrupo, valorOriginal: e.target.value })}
              placeholder="0.00"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Número de Parcelas (opcional)</Form.Label>
            <Form.Control
              type="number"
              value={novoGrupo.numParcelas || ''}
              onChange={(e) => setNovoGrupo({ ...novoGrupo, numParcelas: e.target.value })}
              placeholder="Ex: 12"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrição (opcional)</Form.Label>
            <Form.Control
              type="text"
              value={novoGrupo.descricao || ''}
              onChange={(e) => setNovoGrupo({ ...novoGrupo, descricao: e.target.value })}
              placeholder="Ex: Compra no Amazon"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn-icon btn-cancel" onClick={() => setShowCreateGrupo(false)}>
            Cancelar
          </button>
          <button className="btn-novo-lancamento-modal" onClick={saveNewGrupo}>
            Criar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default LancamentoTable;
