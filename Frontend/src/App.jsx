// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MenuCentral from "./pages/MenuCentral.jsx";
import Modelos from "./pages/Modelos.jsx";
import Pesquisas from "./pages/Pesquisas.jsx";
import CriarModelos from "./pages/CriarModelos.jsx";


export default function App() {
  return (
    <>
      <nav style={{ padding: 12 }}>
        <Link to="/Login">Login</Link> |{" "}
        <Link to="/Register">Registro</Link> |{" "}
        <Link to="/Menu-central">Menu Central</Link> |{" "}
        <Link to="/Modelos">Modelos</Link> |{" "}
        <Link to="/Pesquisas">Pesquisas</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu-central" element={<MenuCentral />} />
        <Route path="/modelos" element={<Modelos />} />
        <Route path="/pesquisas" element={<Pesquisas />} />
        <Route path="/CriarModelos" element={<CriarModelos />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}
