import React, {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [messageError, setMessageError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            email,
            senha,
        };

        fetch('http://localhost:3000/users/loginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(async (response) => {
                let responseBody = await response.json();
                console.log('Resposta da API: ', responseBody);
                if (response.ok) {
                    setMessageError(null);
                    setEmail('');
                    setSenha('');

                    const userId = responseBody.user.id;

                    navigate(`/carteira/${userId}`);
                }
                else {
                    setMessageError(responseBody.error)
                }
            })
            .catch((error) => {
                console.error('Erro ao autenticar o usuário: ', error);
            })
    };


    return (
        <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-6">
                    <section className="register-photo" style={{backgroundColor: "transparent", paddingTop: 30}}>
                        <div className="form-container" style={{marginTop: 40}}>
                            <form onSubmit={handleSubmit} style={{height: 525, paddingRight: 30, borderRadius: 20, borderLeftStyle: "none"}}>
                                <h1 className="text-start" style={{fontSize: 36, fontWeight: "bold"}}><strong>Entrar</strong></h1><small style={{fontSize: 14, paddingBottom: 22}}>Está na hora de ver suas finanças.</small>
                                <div className="form-group mb-3 mt-4"><input className="placeholder form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" style={{ background: "white", color: "black"}}/></div>
                                <div className="form-group mb-3"><input className="placeholder form-control" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} id="password" placeholder="Senha" style={{background: "white", color: "black"}}/></div>
                                <Link to="/login" className="already" style={{marginTop: 20, textAlign: "right"}}>Esqueceu sua senha?</Link>
                                <div className="container d-flex align-items-center message-error">
                                    {messageError && <p className="mt-2">{messageError}</p>}
                                </div>
                                <div className="form-group mb-3"><button className="btn btn-primary d-block w-100" id="submitButton" type="submit">Login</button></div><Link to="/register" className="already" style={{marginTop: 20}}>Não possui uma conta? Faça o cadastro aqui.</Link>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;