import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuCentral() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuário";

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login", { replace: true });
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Menu Central</h1>
      <p>Bem-vinda(o), {username}.</p>

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        <li><button onClick={() => navigate("/dashboard")}>Dashboard</button></li>
        <li><button onClick={() => navigate("/perfil")}>Perfil</button></li>
        <li><button onClick={() => navigate("/config")}>Configurações</button></li>
      </ul>

      <button style={{ marginTop: 24 }} onClick={logout}>Sair</button>
    </div>
  );
}
