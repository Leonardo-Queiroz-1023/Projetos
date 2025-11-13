// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MenuCentral from "./pages/MenuCentral.jsx";
import Modelos from "./pages/Modelos.jsx";
import Pesquisas from "./pages/Pesquisas.jsx";
import CriarModelos from "./pages/CriarModelos.jsx";

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
          Modelos
        </Link>
        <Link to="/pesquisas" style={navLinkStyle}>
          Pesquisas
        </Link>
        <Link to="/criar-modelos" style={navLinkStyle}>
          Criar Modelos
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu-central" element={<MenuCentral />} />
        <Route path="/modelos" element={<Modelos />} />
        <Route path="/pesquisas" element={<Pesquisas />} />
        <Route path="/criar-modelos" element={<CriarModelos />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}
