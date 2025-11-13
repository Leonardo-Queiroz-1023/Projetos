import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

export default function MenuCentral() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuário";

  // se estiver testando sem login, deixa comentado
  // useEffect(() => {
  //   const logged = localStorage.getItem("logged") === "true";
  //   if (!logged) {
  //     navigate("/login?msg=Logue%20antes%20de%20ir%20para%20o%20menu", { replace: true });
  //   }
  // }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("logged");
    navigate("/login", { replace: true });
  }

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
        <h1 style={{ marginBottom: 20 }}>Menu Central</h1>
        <p style={{ marginBottom: 30 }}>Bem-vinda(o), {username}.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <button onClick={() => navigate("/modelos")} style={btn}>
            Modelos
          </button>
          <button onClick={() => navigate("/pesquisas")} style={btn}>
            Pesquisas
          </button>
          <button
            onClick={logout}
            style={{ ...btn, marginTop: 10, background: "#333" }}
          >
            Sair
          </button>
        </div>
      </PerimeterBox>
    </div>
  );
}

const btn = {
  width: "160px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#000",
  color: "#fff",
  margin: "0 auto",
};
