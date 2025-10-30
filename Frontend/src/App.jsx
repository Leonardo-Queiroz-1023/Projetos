// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MenuCentral from "./pages/MenuCentral.jsx";

export default function App() {
  return (
    <>
      <nav style={{ padding: 12 }}>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Registro</Link> |{" "}
        <Link to="/menu-central">Menu Central</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu-central" element={<MenuCentral />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </>
  );
}
