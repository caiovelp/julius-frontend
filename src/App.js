import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CadastroPage from "./pages/CadastroPage";
import LoginPage from "./pages/LoginPage";
import CarteiraPage from "./pages/CarteiraPage";
import ConfiguracaoPage from "./pages/ConfiguracaoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/carteira/:id" element={<CarteiraPage />} />
        <Route path="/configuracao/:id" element={<ConfiguracaoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
