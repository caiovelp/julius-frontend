import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/CadastroPage.css';
import '../components/assets/css/Ludens-Users---2-Register.css';
import '../components/assets/css/Navbar-Right-Links-icons.css';

import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <html>
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap"/>
        </head>
        <body>
            <Navbar/>
            <LoginForm/>
        </body>
        </html>
    )
}

export default LoginPage