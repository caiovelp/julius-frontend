import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import NavbarLogged from "../components/NavbarLogged";

const ConfiguracaoPage = () => {
  const { id } = useParams();
  const [username, setUsername] = useState(null);

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
        }
      })
      .catch((error) => {
        console.error("Erro ao recuperar informações do usuário: ", error);
      });
  };

  useEffect(() => {
    getUserdata();
  }, []);

  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap"
        />
        <title>Configuração</title>
      </head>
      <body>
        <NavbarLogged id={id} username={username} />
        <div class="container-fluid" style={{ marginTop: 20 }}>
          <div class="row">
            <div class="col-md-6 col-xl-12 mb-4">
              <div
                class="card shadow border-start-primary py-2"
                style={{ paddingbottom: 0 }}
              >
                <div class="card-body">
                  <div class="row align-items-center no-gutters">
                    <div class="col offset-xl-0 me-2">
                      <div class="text-dark fw-bold h5 mb-0">
                        <span style={{ paddingbottom: 4, marginbottom: 3 }}>
                          Preferências
                        </span>
                      </div>
                      <div class="text-dark fw-bold h5 mb-0">
                        <span
                          class="fs-6 text-start text-dark"
                          style={{ paddingTop: 0, marginTop: 3 }}
                        >
                          <br />
                          <span>Mostrar lançamentos em ordem:</span>
                        </span>
                        <div class="text-dark fw-bold h5 mb-0">
                          <span
                            class="fs-6 text-start text-dark"
                            style={{ paddingTop: 0, marginTop: 3 }}
                          >
                            <br />
                            <span>Frequência das receitas:</span>
                          </span>
                          <div class="text-dark fw-bold h5 mb-0">
                            <span
                              class="fs-6 text-start text-dark"
                              style={{ paddingTop: 0, marginTop: 3 }}
                            >
                              <br />
                              <span>Principal moeda:</span>
                            </span>
                            <div class="text-dark fw-bold h5 mb-0">
                              <span
                                class="fs-6 text-start text-dark"
                                style={{ paddingTop: 0, marginTop: 3 }}
                              >
                                <br />
                                <span>País atual:</span>
                              </span>
                              <div class="text-dark fw-bold h5 mb-0">
                                <span
                                  class="fs-6 text-start text-dark"
                                  style={{ paddingTop: 0, marginTop: 3 }}
                                >
                                  <br />
                                  <span>Idioma atual:</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col offset-xl-0 me-2">
                      <div class="text-dark fw-bold h5 mb-0">
                        <select
                          class="border rounded-pill border-secondary"
                          style={{
                            marginLeft: 21,
                            fontSize: 14,
                            marginTop: 42,
                          }}
                          data-bs-theme="light"
                        >
                          <optgroup>
                            <option value="1" selected>
                              Crescente
                            </option>
                            <option value="1">Decrescente</option>
                          </optgroup>
                        </select>
                        <div
                          class="text-dark fw-bold h5 mb-0"
                          style={{ marginTop: 22 }}
                        >
                          <select
                            class="border rounded-pill border-secondary"
                            style={{ marginLeft: 21, fontSize: 14 }}
                            data-bs-theme="light"
                          >
                            <optgroup>
                              <option value="1" selected>
                                Diária
                              </option>
                              <option value="1">Semanal</option>
                              <option value="-1">Mensal</option>
                              <option value="5">Variável</option>
                            </optgroup>
                          </select>
                          <div
                            class="text-dark fw-bold h5 mb-0"
                            style={{ marginTop: 22 }}
                          >
                            <select
                              class="border rounded-pill border-secondary"
                              style={{ marginLeft: 21, fontSize: 14 }}
                              data-bs-theme="light"
                            >
                              <optgroup>
                                <option value="1" selected>
                                  Real (R$)
                                </option>
                                <option value="5">Canadian Dollar ($)</option>
                                <option value="1">Euro (€)</option>
                                <option value="2">US Dollar ($)</option>
                              </optgroup>
                            </select>
                            <div
                              class="text-dark fw-bold h5 mb-0"
                              style={{ marginTop: 22 }}
                            >
                              <select
                                class="border rounded-pill border-secondary"
                                style={{ marginLeft: 21, fontSize: 14 }}
                                data-bs-theme="light"
                              >
                                <optgroup>
                                  <option value="1" selected>
                                    Brasil
                                  </option>
                                  <option value="5">Canadá</option>
                                  <option value="1">Dinamarca</option>
                                  <option value="2">Estados Unidos</option>
                                </optgroup>
                              </select>
                              <div
                                class="text-dark fw-bold h5 mb-0"
                                style={{ marginTop: 22 }}
                              >
                                <select
                                  class="border rounded-pill border-secondary"
                                  style={{ marginLeft: 21, fontSize: 14 }}
                                  data-bs-theme="light"
                                >
                                  <optgroup>
                                    <option value="1" selected>
                                      Português (BR)
                                    </option>
                                    <option value="5">English (US)</option>
                                    <option value="1">Español (ES)</option>
                                    <option value="2">Português (PT)</option>
                                  </optgroup>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6 col-xl-12 mb-4">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="text-dark fw-bold m-0">Começar do zero</h6>
                </div>
                <div class="card-body">
                  <h4 class="small fw-bold">
                    Significa apagar todas as transações bancárias, os
                    investimentos, os saldos, ou seja tudo!{" "}
                  </h4>
                  <button
                    class="btn btn-danger"
                    type="button"
                    style={{ marginTop: 13 }}
                  >
                    Limpar movimentações
                  </button>
                </div>
              </div>
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="text-dark fw-bold m-0">Excluir conta</h6>
                </div>
                <div class="card-body">
                  <h4 class="small fw-bold">
                    Já é hora de dizer tchau? Aqui você pode excluir sua conta
                    definitivamente.{" "}
                  </h4>
                  <button
                    class="btn btn-danger"
                    type="button"
                    style={{ marginTop: 13 }}
                  >
                    Excluir conta definitivamente
                  </button>
                </div>
              </div>
              <button
                class="btn btn-success d-xl-flex"
                type="button"
                style={{ marginTop: 13 }}
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default ConfiguracaoPage;
