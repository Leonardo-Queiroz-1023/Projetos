import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

export default function MenuCentral() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuário";
  const [showPesquisasMenu, setShowPesquisasMenu] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("logged");
    navigate("/login", { replace: true });
  }

  return (
    <div style={outer}>
      <PerimeterBox style={{ padding: 0, background: "transparent", boxShadow: "none" }}>
        <div style={blackCard}>
          <header style={header}>
            <h2 style={{ margin: 0 }}>SMART SURVEYS</h2>
            <div style={{ color: "#ddd", fontSize: 13 }}>Bem-vinda(o), {username}</div>
          </header>

          <main style={grid}>
            {/* Resumo */}
            <div style={summaryCard} onClick={() => navigate("/menu-central")}>
              <div style={summaryText}>RESUMO GERAL</div>
            </div>

            {/* Coluna de atalhos */}
            <div style={rightColumn}>
              {/* Auth */}
              <button style={smallCard} onClick={() => navigate("/login")}>Login</button>
              <button style={smallCard} onClick={() => navigate("/register")}>Cadastro</button>

              {/* Modelos */}
              <button style={smallCard} onClick={() => navigate("/modelos")}>Listar Modelos</button>
              <button style={smallCard} onClick={() => navigate("/modelos/criar")}>Criar Modelo</button>
              {/* Exemplo de edição (troque o :id no navegador) */}
              <button style={smallCard} onClick={() => navigate("/modelos/editar/1")}>Editar Modelo (ID 1)</button>

              {/* Pesquisas */}
              <button style={smallCard} onClick={() => navigate("/pesquisas")}>Pesquisas</button>
              <button style={smallCard} onClick={() => navigate("/selecionar-pesquisa")}>Selecionar Pesquisa</button>
              <button style={smallCard} onClick={() => navigate("/lancar-pesquisas")}>Lançar Pesquisas</button>
              <button style={smallCard} onClick={() => navigate("/disparar-pesquisa/1")}>Disparar Pesquisa (Modelo 1)</button>
              <button style={smallCard} onClick={() => navigate("/pesquisas-em-andamento")}>Em Andamento</button>
              <button style={smallCard} onClick={() => navigate("/responder-pesquisa/1")}>Responder Pesquisa (ID 1)</button>

              {/* Resultados */}
              <button style={smallCard} onClick={() => navigate("/resultados/1")}>Resultados (Pesquisa 1)</button>
              <button style={smallCard} onClick={() => navigate("/resultados-detalhe/1/5")}>
                Resultado Detalhe (Pesquisa 1 • 5 estrelas)
              </button>
            </div>

            {/* Destaque de Andamento */}
            <div style={ongoingCard} onClick={() => navigate("/pesquisas-em-andamento")}>
              <div style={{ fontSize: 16 }}>Pesquisas em andamento</div>
            </div>

            {/* Sair */}
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", marginTop: 12 }}>
              <button style={logoutBtn} onClick={logout}>Sair</button>
            </div>
          </main>
        </div>
      </PerimeterBox>
    </div>
  );
}

const outer = {
  minHeight: "calc(100vh - 50px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "sans-serif",
  padding: 20,
};

const blackCard = {
  width: 720,
  maxWidth: "94vw",
  background: "#0b0b0b",
  borderRadius: 24,
  padding: 20,
  color: "#fff",
  boxSizing: "border-box",
  border: "6px solid #000",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
  padding: "0 8px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 260px",
  gridTemplateRows: "1fr auto",
  gridTemplateAreas: `"summary tiles" "ongoing ongoing"`,
  gap: 16,
  alignItems: "stretch",
};

const summaryCard = {
  gridArea: "summary",
  background: "#e9e9e9",
  color: "#111",
  borderRadius: 12,
  padding: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  minHeight: 160,
};

const summaryText = {
  fontSize: 18,
  fontWeight: 600,
  textAlign: "center",
};

const rightColumn = {
  gridArea: "tiles",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  alignItems: "stretch",
};

const smallCard = {
  background: "#e9e9e9",
  color: "#111",
  borderRadius: 12,
  padding: "14px 12px",
  border: "none",
  cursor: "pointer",
  textAlign: "center",
  fontSize: 14,
};

const ongoingCard = {
  gridArea: "ongoing",
  background: "#e9e9e9",
  color: "#111",
  borderRadius: 12,
  padding: 18,
  minHeight: 120,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  marginTop: 4,
};

const logoutBtn = {
  background: "#86c6ff",
  color: "#023047",
  border: "none",
  padding: "8px 28px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
};
