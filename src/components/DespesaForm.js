import {Form} from "react-bootstrap";
import React, {useState} from "react";
import InputGroup from "react-bootstrap/InputGroup";

const DespesaForm = ({ expenseInfo }) => {
    const [despesaFormData, setDespesaFormData] = useState({
        tipo: expenseInfo.tipo,
        data: expenseInfo.data,
        tag: expenseInfo.tag,
        descricao: expenseInfo.descricao,
        origem: "",
        valor: expenseInfo.valor,
        carteiraId: "",
        categoriaId: "",
        parcela: 1,
        nomeCobranca: ""
    });

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Data</Form.Label>
                <Form.Control
                    type="date"
                    defaultValue={despesaFormData.data}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Tag</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={despesaFormData.tag}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={despesaFormData.descricao}
                />
            </Form.Group>

            <InputGroup className="mb-3">
                <InputGroup.Text>R$</InputGroup.Text>
                <Form.Control
                    type="number"
                    min="0.00"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={despesaFormData.valor}
                />
            </InputGroup>
        </Form>
    )
}

export default DespesaForm;