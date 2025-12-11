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
import VisualizarPesquisa from "./pages/VisualizarPesquisa.jsx";

import LancarPesquisas from "./pages/LancarPesquisas.jsx";
import DispararPesquisa from "./pages/DispararPesquisa.jsx";
import ResponderPesquisa from "./pages/ResponderPesquisa.jsx";

export default function App() {
  const navStyle = {
    padding: "0 0 4px",          // zero em cima, 4px só pra não colar DEMAIS no menu
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

  const brandStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,                  // sem margem extra em volta do container da logo
  };

  const brandLogoStyle = {
    height: "220px",            // tamanho da logo (pode ajustar aqui)
    maxWidth: "100%",
    objectFit: "contain",
    display: "block",
    marginTop: "-40px",         // puxa a logo pra cima (come menos espaço preto no topo)
    marginBottom: "-16px",      // cola a logo no menu, tirando o “buraco” entre eles
  };

  const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "0",             // garante que os links não adicionem margem pra baixo da logo
  };

  const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={brandStyle}>
          <img
            src="/LogoPositivo.png"
            alt="Smart Surveys"
            style={brandLogoStyle}
          />
        </div>
        <div style={navLinksStyle}>
          <Link to="/login" style={navLinkStyle}>Login</Link>
          <Link to="/register" style={navLinkStyle}>Cadastro</Link>
          <Link to="/menu-central" style={navLinkStyle}>Menu</Link>
          <Link to="/modelos" style={navLinkStyle}>Modelos</Link>
          <Link to="/pesquisas" style={navLinkStyle}>Pesquisas</Link>
          <Link to="/pesquisas-em-andamento" style={navLinkStyle}>Em Andamento</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu-central" element={<MenuCentral />} />

        {/* Modelos */}
        <Route path="/modelos" element={<ListarModelos />} />
        <Route path="/modelos/criar" element={<CriarModelos />} />
        <Route path="/modelos/editar/:id" element={<EditarModelo />} />

        {/* Pesquisas (Admin) */}
        <Route path="/pesquisas" element={<Pesquisas />} />
        <Route path="/pesquisas/criar" element={<CriarPesquisa />} />
        <Route path="/selecionar-pesquisa" element={<SelecionarPesquisa />} />
        <Route path="/pesquisas-em-andamento" element={<PesquisasAndamento />} />
        <Route path="/resultados" element={<ParametrosPesquisa />} />
        <Route path="/pesquisas/visualizar/:id" element={<VisualizarPesquisa />} />

        {/* Disparo & resposta */}
        <Route path="/lancar-pesquisas" element={<LancarPesquisas />} />
        <Route path="/disparar-pesquisa/:pesquisaId" element={<DispararPesquisa />} />
        <Route path="/responder/:pesquisaId/:respondenteId" element={<ResponderPesquisa />} />

        <Route
          path="*"
          element={
            <div style={{ padding: 40, color: "white", textAlign: "center" }}>
              404 - Página não encontrada
            </div>
          }
        />
      </Routes>
    </>
  );
}
