import React, {useEffect, useState} from "react";

import '../styles/WalletResume.css';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import {Cash} from 'react-bootstrap-icons'
import ConfigCategoryButton from "./ConfigCategoryButton";
import RoscaCategoryChart from "./RoscaCategoryChart";

const WalletResume = ({ saldo, walletId, name }) => {
    const [receitaMensal, setReceitaMensal] = useState(0.00);
    const [showReceitaModal, setShowReceitaModal] = useState(false);
    const [receitaFormData, setReceitaFormData] = useState({
       date: "",
       description: "",
       amount: 0.00,
    });

    const [despesaMensal, setDespesaMensal] = useState(0.00);
    const [showDespesaModal, setShowDespesaModal] = useState(false);
    const [despesaFormData, setDespesaFormData] = useState({
        tipo: "Fixa",
        data: "",
        tag: name,
        descricao: "",
        origem: "",
        valor: 0.00,
        carteiraId: "",
        categoriaId: "",
        parcela: 1,
        nomeCobranca: ""
    });
    const [despesaCategoriaOpt, setdespesaCategoriaOpt] = useState([]);

    const handleCloseReceitaModal = () => setShowReceitaModal(false);
    const handleShowReceitaModal = () => setShowReceitaModal(true);

    const handleCloseDespesaModal = () => setShowDespesaModal(false);
    const handleShowDespesaModal = () => setShowDespesaModal(true);

    const handleSubmitReceitaForm = (e) => {
        e.preventDefault();

        const { date, description, amount } = receitaFormData;


        let data = JSON.stringify({
            "carteiraId": walletId,
            "data": date,
            "descricao": description,
            "valor": amount
        });

        console.log(data);

        fetch('http://localhost:3000/credit/createReceita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
            .then(async (response) => {
                let responseBody = await response.json();
                console.log("Response: ", responseBody);
                if(response.ok) {
                    setReceitaFormData({
                        date: "",
                        description: "",
                        amount: 0.00,
                    });
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar informações da carteira do usuário: ', error);
            })
    };

    const handleSubmitDespesaForm = (e) => {
        e.preventDefault();

        const { tipo, date, tag, descricao, origem, valor,
            carteiraId, categoriaId, parcela,nomeCobranca } = despesaFormData;


        let data = JSON.stringify({
            "tipo": tipo,
            "data": date,
            "tag": tag === "" ? name : tag,
            "descricao": descricao,
            "origem": origem,
            "valor": valor,
            "carteiraId": walletId,
            "categoriaId": categoriaId,
            "parcela": parcela,
            "nomeCobranca": nomeCobranca
        });

        console.log(data);

        fetch(`http://localhost:3000/expense/createDespesa/${walletId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
            .then(async (response) => {
                let responseBody = await response.json();
                console.log("Response: ", responseBody);
                if(response.ok) {
                    console.log("Despesa criada com sucesso.");
                    setDespesaFormData({
                        tipo: "Fixa",
                        data: "",
                        tag: name,
                        descricao: "",
                        origem: "",
                        valor: 0.00,
                        carteiraId: "",
                        categoriaId: "",
                        parcela: 1,
                        nomeCobranca: ""
                    });
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar informações da carteira do usuário: ', error);
            })
    }

    const getExpensesCategory = () => {
        fetch(`http://localhost:3000/category/getCategoriasByWalletId/${walletId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                let responseBody = await response.json();
                if (response.ok) {
                    setdespesaCategoriaOpt(responseBody);
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar informações de categoria de despesa do usuário: ', error);
            });
    }

    const updateReceitaMensal = () => {
        fetch(`http://localhost:3000/credit/getValorReceitaMensal/${walletId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                let responseBody = await response.json();
                if (response.ok) {
                    let receitaMensalNumber = parseFloat(responseBody.receitaMensal);
                    setReceitaMensal(receitaMensalNumber);
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar a receita mensal do usuário: ', error);
            });
    }

    const updateDespesaMensal = () => {
        fetch(`http://localhost:3000/expense/getValorDespesaMensal/${walletId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                let responseBody = await response.json();
                console.log(responseBody);
                if (response.ok) {
                    let despesaMensalNumber = parseFloat(responseBody.despesaMensal);
                    setDespesaMensal(despesaMensalNumber);
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar a despesa mensal do usuário: ', error);
            });
    }

    useEffect(() => {
        getExpensesCategory();
        updateReceitaMensal();
        updateDespesaMensal();
    }, [walletId]);

    return (
        <div className="container rounded-4">
            <div className="row">
                <div className="col-md-4 mt-4">
                    <div className="row">
                        <div className="col">
                            <h3 className="pt-3">Saldo Mensal</h3>
                            <h4 className="saldo">R$ {saldo}</h4>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                            <h5>Receita Mensal</h5>
                            <h5 className="receita-mensal">R$ {receitaMensal.toFixed(2)}</h5>
                        </div>
                        <div className="col">
                            <h5>Despesa Mensal</h5>
                            <h5 className="despesa-mensal">R$ {despesaMensal.toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mt-4 d-flex justify-content-center">
                    <RoscaCategoryChart carteiraId={walletId}/>
                </div>
                <div className="col-md-4 mt-4 d-flex flex-column justify-content-center align-items-center" style={{ marginBottom: 9 }}>
                    <h4 style={{ marginTop: 5 }}>Acesso Rápido</h4>
                    <Button variant="" className="d-flex justify-content-start align-items-center button-quick-access" onClick={handleShowReceitaModal}>
                        <Cash className="receipt-icon"/>
                        Receita
                    </Button>

                    <Modal show={showReceitaModal} onHide={handleCloseReceitaModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adicionar Receita</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmitReceitaForm}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={receitaFormData.date}
                                        onChange={(e) => setReceitaFormData({ ...receitaFormData, date: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Salário"
                                        value={receitaFormData.description}
                                        onChange={(e) => setReceitaFormData({ ...receitaFormData, description: e.target.value })}
                                    />
                                </Form.Group>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>R$</InputGroup.Text>
                                    <Form.Control type="number"
                                                  min="0.00"
                                                  step="0.01"
                                                  placeholder="0.00"
                                                  value={receitaFormData.amount}
                                                  onChange={(e) => setReceitaFormData({ ...receitaFormData, amount: parseFloat(e.target.value) })}
                                    />
                                </InputGroup>


                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <Button variant="" className="d-flex justify-content-start align-items-center button-quick-access" onClick={handleShowDespesaModal}>
                        <Cash className="expense-icon"/>
                        Despesa
                    </Button>

                    <Modal show={showDespesaModal} onHide={handleCloseDespesaModal} scrollable={true}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adicionar Despesa</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmitDespesaForm}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={despesaFormData.date}
                                        onChange={(e) => setDespesaFormData({ ...despesaFormData, date: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 d-flex">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Check
                                        className="mx-4"
                                        type="radio"
                                        label="Fixa"
                                        name="options"
                                        defaultChecked
                                        value={despesaFormData.tipo}
                                        onChange={() => setDespesaFormData({...despesaFormData, tipo: "Fixa"})}
                                    />
                                    <Form.Check
                                        className="mx-4"
                                        type="radio"
                                        label="Variável"
                                        name="options"
                                        value={despesaFormData.tipo}
                                        onChange={() => setDespesaFormData({...despesaFormData, tipo: "Variável"})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Tag</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Identifica de quem é a despesa (Mãe, Própria, Pai)"
                                        defaultValue={name}
                                        value={name}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, tag: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Parcelas</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="12"
                                        step="1"
                                        placeholder="0"
                                        value={despesaFormData.parcela}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, parcela: parseInt(e.target.value)})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Lanche"
                                        value={despesaFormData.descricao}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, descricao: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nome na Cobrança</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Ifood"
                                        value={despesaFormData.nomeCobranca}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, nomeCobranca: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Origem</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ex: Cartão Inter"
                                        value={despesaFormData.origem}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, origem: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Categoria de Despesa</Form.Label>
                                    <Form.Select
                                        value={despesaFormData.categoriaId}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, categoriaId: e.target.value})}
                                    >
                                        <option disabled={true} value="">Categoria...</option>
                                        {despesaCategoriaOpt.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text>R$</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        min="0.00"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={despesaFormData.valor}
                                        onChange={(e) => setDespesaFormData({...despesaFormData, valor: parseFloat(e.target.value)})}
                                    />
                                </InputGroup>


                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    <ConfigCategoryButton carteiraId={walletId}/>
                </div>
            </div>
        </div>
    )
}

export default WalletResume;