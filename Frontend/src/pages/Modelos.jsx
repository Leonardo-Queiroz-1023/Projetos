// src/pages/Modelos.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

export default function Modelos() {
  const navigate = useNavigate();
  const logged = localStorage.getItem("logged") === "true";

  // se estiver testando sem login, deixa comentado
  // useEffect(() => {
  //   if (!logged) {
  //     navigate("/login?msg=Logue%20antes%20de%20acessar%20modelos", {
  //       replace: true,
  //     });
  //   }
  // }, [logged, navigate]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 50px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <PerimeterBox style={{ textAlign: "center", width: "320px" }}>
        <h1 style={{ marginBottom: 20 }}>Modelos</h1>
        <p style={{ marginBottom: 25 }}>
          Escolha o que deseja fazer com os modelos.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <button
            style={btn}
            onClick={() => alert("abrir tela de criar modelo")}
          >
            Criar modelos
          </button>
          <button
            style={btn}
            onClick={() => alert("abrir tela de editar modelo")}
          >
            Editar modelos
          </button>
          <button
            style={{ ...btn, background: "#444" }}
            onClick={() => navigate("/menu-central")}
          >
            Voltar ao menu
          </button>
        </div>
      </PerimeterBox>
    </div>
  );
}

const btn = {
  width: "200px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#000",
  color: "#fff",
  margin: "0 auto",
};
