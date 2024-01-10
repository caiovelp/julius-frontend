import React, {useState} from "react";
import { Link, useNavigate } from 'react-router-dom';

const CadastroForm = () => {
    const [nome, setNome] = useState('');
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
    const [email, setEmail] = useState('');
    const [messageError, setMessageError] = useState(null);
    const [messageSuccess, setMessageSuccess] = useState(null);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            nome,
            username,
            senha,
            senhaConfirmacao,
            email,
        };

        fetch('http://localhost:3000/users/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(async (response) => {
                let responseBody = await response.json();
                if (response.ok) {
                    setMessageError(null);
                    setMessageSuccess('Usuário criado com sucesso.');
                    setNome('');
                    setUsername('');
                    setSenha('');
                    setSenhaConfirmacao('');
                    setEmail('');
                } else {
                    setMessageError(responseBody.error)
                }
            })
            .catch((error) => {
                console.error('Erro ao cadastrar o usuário: ', error);
            })
    };


    return (
        <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-9">
                    <section className="register-photo" style={{backgroundColor: "transparent", paddingTop: 30}}>
                        <div className="form-container" style={{marginTop: 40}}>
                            <form onSubmit={handleSubmit} style={{height: 525, paddingRight: 30, borderRadius: 20, borderLeftStyle: "none"}}>
                                <h1 className="text-start" style={{fontSize: 36, fontWeight: "bold"}}><strong>Cadastro</strong></h1><small style={{fontSize: 14, paddingBottom: 22}}>Um novo começo para sua vida financeira.</small>
                                <div className="form-group mb-3"><input className="placeholder form-control" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" style={{background: "white", marginTop: 25, color: "black"}}/></div>
                                <div className="form-group mb-3"><input className="placeholder form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{background: "white", borderStyle: "none", color: "black"}}/></div>
                                <div className="form-group mb-3"><input className="placeholder form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" style={{ background: "white", color: "black"}}/></div>
                                <div className="form-group mb-3"><input className="placeholder form-control" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} id="password" placeholder="Senha" style={{background: "white", color: "black"}}/></div>
                                <div className="form-group mb-3"><input className="placeholder form-control" type="password" value={senhaConfirmacao} onChange={(e) => setSenhaConfirmacao(e.target.value)} id="confirmPassword" name="senha-repeat" placeholder="Confirmação de senha" style={{background: "white", color: "black"}}/></div>
                                <div className="form-group mb-3">
                                    <div className="form-check"><label className="form-check-label"><input className="form-check-input" type="checkbox" checked={isCheckboxChecked} onChange={(e) => setIsCheckboxChecked(e.target.checked)}/>Concordo com os Termos de Uso.</label></div>
                                </div>
                                <div className="container d-flex align-items-center message-error">
                                    {messageError && <p className="mt-2">{messageError}</p>}
                                </div>
                                <div className="container d-flex align-items-center message-success">
                                    {messageSuccess && <p className="mt-2">{messageSuccess}</p>}
                                </div>
                                <div className="form-group mb-3"><button className="btn btn-primary d-block w-100" disabled={!isCheckboxChecked} id="submitButton" type="submit">Cadastrar</button></div><Link to="/login" className="already" style={{marginTop: 20}}>Já possui uma conta? Inicie a sessão aqui.</Link>
                            </form>
                            <div className="text-center image-holder" style={{borderTopRightRadius: 20, borderBottomRightRadius: 20, borderRightStyle: "none"}}>
                                <h3 className="text-uppercase text-center"><strong>Benefícios</strong></h3>
                                <ul className="list-group" style={{borderLeftStyle: "none", marginTop: 145}}>
                                    <li className="list-group-item d-flex justify-content-between" style={{background: "transparent", borderStyle: "none", borderLeftStyle: "none", paddingTop: 8, paddingBottom: 20}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                                        <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"></path>
                                    </svg><span>100% Gratuito</span></li>
                                    <li className="list-group-item d-flex justify-content-between" style={{background: "transparent", borderStyle: "none", paddingBottom: 20}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                                        <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"></path>
                                    </svg><span>Monitore seus gastos</span></li>
                                    <li className="list-group-item d-flex justify-content-between" style={{background: "transparent", borderStyle: "none", paddingBottom: 20}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                                        <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"></path>
                                    </svg><span>Dicas de Investimento</span></li>
                                    <li className="list-group-item d-flex justify-content-between" style={{background: "transparent", borderStyle: "none"}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
                                        <path d="M243.8 339.8C232.9 350.7 215.1 350.7 204.2 339.8L140.2 275.8C129.3 264.9 129.3 247.1 140.2 236.2C151.1 225.3 168.9 225.3 179.8 236.2L224 280.4L332.2 172.2C343.1 161.3 360.9 161.3 371.8 172.2C382.7 183.1 382.7 200.9 371.8 211.8L243.8 339.8zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"></path>
                                    </svg><span>Controle as suas finanças</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CadastroForm;