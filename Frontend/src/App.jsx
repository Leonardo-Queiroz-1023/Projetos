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
import LancarPesquisas from "./pages/LancarPesquisas.jsx";
import DispararPesquisa from "./pages/DispararPesquisa.jsx";
import ResponderPesquisa from "./pages/ResponderPesquisa.jsx";

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

const brandStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
};

const navLinksStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,
  flexWrap: "wrap",
};

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: 500,
};

export default function App() {
  return (
    <>
      <nav style={navStyle}>
        <div style={brandStyle}>
          <span
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 1,
            }}
          >
            SMART SURVEYS
          </span>
        </div>

        <div style={navLinksStyle}>
          <Link to="/login" style={navLinkStyle}>
            Login
          </Link>
          <Link to="/register" style={navLinkStyle}>
            Registro
          </Link>
          <Link to="/menu-central" style={navLinkStyle}>
            Menu Central
          </Link>
          <Link to="/modelos" style={navLinkStyle}>
            Listar Modelos
          </Link>
          <Link to="/modelos/criar" style={navLinkStyle}>
            Criar Modelos
          </Link>
          <Link to="/pesquisas" style={navLinkStyle}>
            Pesquisas
          </Link>
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
        <Route path="/lancar-pesquisas" element={<LancarPesquisas />} />
        <Route path="/disparar-pesquisa/:modeloId" element={<DispararPesquisa />} />
        <Route path="/responder/:token" element={<ResponderPesquisa />} />
        <Route path="/pesquisas-em-andamento" element={<PesquisasAndamento />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}
