import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MesPage from "./pages/MesPage";

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/mes/${getCurrentMonth()}`} replace />} />
        <Route path="/mes/:yyyyMM" element={<MesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
