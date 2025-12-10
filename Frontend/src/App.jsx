// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MenuCentral from "./pages/MenuCentral.jsx";
import ListarModelos from "./pages/ListarModelos.jsx";
import CriarModelos from "./pages/CriarModelos.jsx";
import EditarModelo from "./pages/EditarModelo.jsx";
import Pesquisas from "./pages/Pesquisas.jsx";
import CriarPesquisa from "./pages/CriarPesquisa.jsx";
import SelecionarPesquisa from "./pages/secionar_pesquisar.jsx";
import PesquisasAndamento from "./pages/pesquisas_andamento.jsx";
import ParametrosPesquisa from "./pages/parametros_pesquisa.jsx";

// ATENÇÃO: resultatos_detalhe.jsx e responder_pesquisa.jsx não estão na pasta src/pages.
// Adicione as rotas quando os arquivos existirem.

export default function App() {
  const navStyle = {
    padding: "10px 32px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderBottom: "2px solid white",
    position: "sticky",
    top: 0,
    width: "100%",
    boxSizing: "border-box",
    zIndex: 10,
  };
  const brandStyle = { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 };
  const navLinksStyle = { display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", flexWrap: "wrap" };
  const navLinkStyle = { color: "white", textDecoration: "none", fontWeight: 500 };

  return (
    <>
      <nav style={navStyle}>
        <div style={brandStyle}>
          <span style={{ fontSize: 24, color: "white" }}>🧠 SMART SURVEYS</span>
        </div>
        <div style={navLinksStyle}>
          <Link to="/login" style={navLinkStyle}>Login</Link>
          <Link to="/register" style={navLinkStyle}>Cadastro</Link>
          <Link to="/menu-central" style={navLinkStyle}>Menu</Link>
          <Link to="/modelos" style={navLinkStyle}>Modelos</Link>
          <Link to="/pesquisas" style={navLinkStyle}>Pesquisas</Link>
          <Link to="/selecionar-pesquisa" style={navLinkStyle}>Selecionar Pesquisa</Link>
          <Link to="/pesquisas-em-andamento" style={navLinkStyle}>Em Andamento</Link>
          <Link to="/resultados/1" style={navLinkStyle}>Resultados</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu-central" element={<MenuCentral />} />

        <Route path="/modelos" element={<ListarModelos />} />
        <Route path="/modelos/criar" element={<CriarModelos />} />
        <Route path="/modelos/editar/:id" element={<EditarModelo />} />

        <Route path="/pesquisas" element={<Pesquisas />} />
        <Route path="/pesquisas/criar" element={<CriarPesquisa />} />
        <Route path="/selecionar-pesquisa" element={<SelecionarPesquisa />} />
        <Route path="/pesquisas-em-andamento" element={<PesquisasAndamento />} />

        <Route path="/resultados/:id" element={<ParametrosPesquisa />} />

        {/* Adicione quando criar os arquivos: */}
        {/* <Route path="/responder-pesquisa/:id" element={<ResponderPesquisa />} /> */}
        {/* <Route path="/resultados-detalhe/:pesquisaId/:perguntaId" element={<ResultadosDetalhe />} /> */}

        <Route path="*" element={<div style={{ padding: 40, color: "white", textAlign: "center" }}>404 - Página não encontrada</div>} />
      </Routes>
    </>
  );
}

