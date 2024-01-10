import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {Tags} from 'react-bootstrap-icons';

import '../styles/WalletResumeButtons.css';

const ConfigCategoryButton = ({ carteiraId }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Initialize with an empty string
    const [limiteValue, setLimiteValue] = useState(''); // To store and update the limite value

    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    const handleCloseCategoriaModal = () => setShowCategoriaModal(false);
    const handleShowCategoriaModal = () => setShowCategoriaModal(true);

    useEffect(() => {
        fetch(`http://localhost:3000/category/getCategoriasByWalletId/${carteiraId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                let responseBody = await response.json();
                if (response.ok) {
                    setCategoryOptions(responseBody);
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar informações de categoria de despesa do usuário: ', error);
            });
    }, [carteiraId]);

    const handleCategoryChange = (event) => {
        const selectedCategoryId = event.target.value;
        setSelectedCategoryId(selectedCategoryId);

        const selectedCategoryObj = categoryOptions.find((category) => category.id === selectedCategoryId);
        if (selectedCategoryObj) {
            setLimiteValue(selectedCategoryObj.limite);
        } else {
            setLimiteValue('');
        }
    };

    const handleSaveChanges = () => {
        let data = {
            id: selectedCategoryId,
            limite: parseFloat(limiteValue)
        };

        fetch(`http://localhost:3000/category/editCategoria/${carteiraId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Limite da categoria alterado com sucesso.');
                    const selectedCategoryObj = categoryOptions.find((category) => category.id === selectedCategoryId);
                    if (selectedCategoryObj) {
                        setLimiteValue(selectedCategoryObj.limite);
                    } else {
                        setLimiteValue('');
                    }

                } else {
                    console.error('Erro ao alterar limite.');
                }
            })
            .catch((error) => {
                console.error('API request error:', error);
            });
    };

    return (
        <div>
            <Button
                variant=""
                className="d-flex justify-content-start align-items-center button-quick-access"
                onClick={handleShowCategoriaModal}
            >
                <Tags className="categoria-icon" />
                Categoria
            </Button>

            <Modal show={showCategoriaModal} onHide={handleCloseCategoriaModal} scrollable={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Configurar categorias de despesa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select value={selectedCategoryId} onChange={handleCategoryChange}>
                                <option value="">Categoria...</option>
                                {categoryOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nome}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Limite</Form.Label>
                            <Form.Control
                                type="number"
                                value={limiteValue}
                                onChange={(e) => setLimiteValue(e.target.value)}
                            />
                        </Form.Group>

                        <Button className="mt-3" variant="primary" type="submit" onClick={handleSaveChanges}>
                            Alterar limite
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ConfigCategoryButton;
