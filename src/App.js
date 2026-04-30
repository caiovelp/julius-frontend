import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CadastroPage from "./pages/CadastroPage";
import LoginPage from "./pages/LoginPage";
import CarteiraPage from "./pages/CarteiraPage";
import ConfiguracaoPage from "./pages/ConfiguracaoPage";

// Default guest user ID when authentication is disabled
const GUEST_USER_ID = process.env.REACT_APP_GUEST_USER_ID || '1';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root route redirects to guest wallet */}
        <Route path="/" element={<Navigate to={`/carteira/${GUEST_USER_ID}`} replace />} />
        
        <Route path="/register" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/carteira/:id" element={<CarteiraPage />} />
        <Route path="/configuracao/:id" element={<ConfiguracaoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
