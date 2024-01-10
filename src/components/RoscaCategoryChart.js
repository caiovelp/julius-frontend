import React, {useEffect, useState} from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const RoscaCategoryChart = ({ carteiraId }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [categoryValues, setCategoryValues] = useState([]);

    const getCategoryExpenses = () => {
        fetch(`http://localhost:3000/expense/getDespesasMensaisAgrupadasPorCategoria/${carteiraId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                let responseBody = await response.json();
                if(response.ok) {
                    let categoriasAgrupadas = responseBody.despesasAgrupadasPorCategoria;

                    let nomesCategoria = categoriasAgrupadas.map(categoriaAgrupada => categoriaAgrupada.Categoria.nome);
                    setCategoryOptions(nomesCategoria);

                    let valoresCategoria = categoriasAgrupadas.map(categoriaAgrupada => categoriaAgrupada.total)
                    setCategoryValues(valoresCategoria)
                }
            })
            .catch((error) => {
                console.error('Erro ao recuperar informações da carteira do usuário: ', error);
            })
    }

    useEffect(() => {
        getCategoryExpenses();
    }, [carteiraId]);

    const data = {
        labels: categoryOptions,
        datasets: [
            {
                label: 'R$',
                data: categoryValues,
                backgroundColor: [
                    '#3A82EF',
                    '#5EE173',
                    '#FFB038',
                ],
                borderWidth: 1,
                offset: 25,
                hoverOffset: 30
            },
        ],
    };

    return(
        <div className="chart-container">
            <Doughnut data={data}/>
        </div>
    )

}

export default RoscaCategoryChart;