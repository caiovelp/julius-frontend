import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/CadastroPage.css';
import '../components/assets/css/Ludens-Users---2-Register.css';
import '../components/assets/css/Navbar-Right-Links-icons.css';

import Navbar from "../components/Navbar";
import CadastroForm from "../components/CadastroForm";

const CadastroPage = ({ onSubmit }) => {
    return (
        <html>
        <head>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap"/>
        </head>
        <body>
            <Navbar/>
            <CadastroForm/>
        </body>
        </html>
    );
};

export default CadastroPage;
