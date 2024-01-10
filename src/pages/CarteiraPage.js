import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "../styles/CarteiraPage.css";

import NavbarLogged from "../components/NavbarLogged";
import WalletResume from "../components/WalletResume";
import MonthExpenseList from "../components/MonthExpenseList";

const CarteiraPage = () => {
  const { id } = useParams();
  const [username, setUsername] = useState(null);
  const [name, setName] = useState("");
  const [saldo, setSaldo] = useState(null);
  const [walletId, setWalletId] = useState(null);

  const getUserdata = () => {
    fetch(`http://localhost:3000/users/getUserById/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        let responseBody = await response.json();
        if (response.ok) {
          let username = responseBody.username;
          setUsername(username);

          let name = responseBody.nome;
          setName(name);
        }
      })
      .catch((error) => {
        console.error("Erro ao recuperar informações do usuário: ", error);
      });
  };

  const getWalletData = () => {
    fetch(`http://localhost:3000/wallets/getCarteiraByUserId/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        let responseBody = await response.json();
        if (response.ok) {
          let saldo = responseBody.saldo;
          setSaldo(saldo);
          let walletId = responseBody.id;
          setWalletId(walletId);
        }
      })
      .catch((error) => {
        console.error(
          "Erro ao recuperar informações da carteira do usuário: ",
          error
        );
      });
  };

  useEffect(() => {
    getUserdata();
    getWalletData();
  }, []);

  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap"
        />
        <title>Carteira</title>
      </head>
      <body>
        <NavbarLogged id={id} username={username} />
        <WalletResume saldo={saldo} walletId={walletId} name={name} />
        <MonthExpenseList carteiraId={walletId} />
      </body>
    </html>
  );
};

export default CarteiraPage;
