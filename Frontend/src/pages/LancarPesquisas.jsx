import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LancarPesquisas() {
  const navigate = useNavigate();

  // MOCK: dados fake para testar
  const modelos = [
    { id: 1, nome: "Pesquisa de Satisfação", descricao: "Avalie nosso atendimento" },
    { id: 2, nome: "NPS", descricao: "Net Promoter Score" },
    { id: 3, nome: "Feedback Produto", descricao: "Opinião sobre o produto" },
  ];

  return (
    <div style={page}>
      <header style={topBar}>
        <div style={brand}>🧠 SMART SURVEYS</div>
        <nav style={navLinks}>
          <Link to="/" style={navLink}>Página Inicial</Link>
          <Link to="/modelos" style={navLink}>Modelos</Link>
          <Link to="/pesquisas" style={navLink}>Pesquisas</Link>
        </nav>
      </header>

      <div style={card}>
        <h2 style={title}>🚀 Lançar Pesquisa</h2>
        <p style={{ color: "#aaa", textAlign: "center", marginBottom: 20 }}>
          Selecione um modelo para disparar
        </p>

        <div style={listaModelos}>
          {modelos.map((modelo) => (
            <div
              key={modelo.id}
              style={modeloCard}
              onClick={() => navigate(`/disparar-pesquisa/${modelo.id}`)}
            >
              <h3 style={{ margin: 0 }}>{modelo.nome}</h3>
              <p style={{ margin: "8px 0 0", color: "#666", fontSize: 14 }}>
                {modelo.descricao}
              </p>
            </div>
          ))}
        </div>

        <button style={backBtn} onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://i.imgur.com/3JpVQcb.png')",
  backgroundSize: "120px 120px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const topBar = {
  width: "100%",
  height: 70,
  background: "#0b0b0b",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "0 14px",
  borderBottom: "2px solid #fff",
};

const brand = { fontWeight: 800, fontSize: 18 };
const navLinks = { display: "flex", gap: 10 };
const navLink = { color: "#fff", textDecoration: "none", fontSize: 14 };

const card = {
  marginTop: 24,
  width: "90%",
  maxWidth: 600,
  background: "#0b0b0b",
  border: "6px solid #000",
  borderRadius: 18,
  padding: 24,
  color: "#fff",
};

const title = { textAlign: "center", margin: "0 0 10px 0", fontSize: 20 };

const listaModelos = { display: "flex", flexDirection: "column", gap: 12 };

const modeloCard = {
  background: "#f5f5f5",
  color: "#111",
  padding: 16,
  borderRadius: 10,
  cursor: "pointer",
  transition: "transform 0.2s",
};

const backBtn = {
  marginTop: 20,
  padding: "8px 20px",
  background: "#f4b7ac",
  color: "#1a1a1a",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};