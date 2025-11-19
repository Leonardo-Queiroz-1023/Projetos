import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

export default function MenuCentral() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuário";
  const [showPesquisasMenu, setShowPesquisasMenu] = useState(false);

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

          {/* Botão Pesquisas com Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowPesquisasMenu(!showPesquisasMenu)}
              style={{ ...btn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              Pesquisas
              <span style={{ fontSize: "12px" }}>
                {showPesquisasMenu ? "▲" : "▼"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showPesquisasMenu && (
              <div style={dropdownMenu}>
                <button
                  onClick={() => navigate("/lancar-pesquisas")}
                  style={dropdownItem}
                >
                  📤 Lançar pesquisas
                </button>
                <button
                  onClick={() => navigate("/pesquisas-em-andamento")}
                  style={dropdownItem}
                >
                  🔄 Visualizar pesquisas em andamento
                </button>
                <button
                  onClick={() => navigate("/pesquisas-finalizadas")}//ainda não existe
                  style={dropdownItem}
                >
                  ✅ Visualizar pesquisas finalizadas
                </button>
              </div>
            )}
          </div>

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

const dropdownMenu = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  marginTop: "8px",
  background: "#fff",
  border: "2px solid #000",
  borderRadius: "8px",
  padding: "8px",
  minWidth: "240px",
  zIndex: 1000,
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
};

const dropdownItem = {
  width: "100%",
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: "#f5f5f5",
  color: "#000",
  marginBottom: "6px",
  textAlign: "left",
  transition: "background 0.2s",
  fontSize: "14px",
};
