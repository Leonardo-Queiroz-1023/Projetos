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

const navStyle = {
  padding: "12px 24px",
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "black",
  borderBottom: "2px solid white",
  position: "sticky",
  top: 0,
  zIndex: 10,
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
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}
