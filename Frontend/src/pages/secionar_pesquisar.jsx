import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SelecionarPesquisa() {
  const navigate = useNavigate();
  const [pesquisas, setPesquisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    carregarPesquisas();
  }, []);

  async function carregarPesquisas() {
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getPesquisas(); // GET /pesquisas
      setPesquisas(data);
    } catch (error) {
      setErro("Erro ao carregar pesquisas");
    } finally {
      setLoading(false);
    }
  }

  function handleSelecionar(pesquisa) {
    setSelecionada(pesquisa);
  }

  function handleProximo() {
    if (selecionada) {
      navigate(`/responder-pesquisa/${selecionada.id}`);
    }
  }

  return (
    <div style={page}>
      <header style={topBar}>
        <div style={brand}>
          <span role="img" aria-label="logo">🧠</span> SMART SURVEYS
        </div>
        <nav style={navLinks}>
          <Link to="/" style={navLink}>Página Inicial</Link>
          <Link to="/login" style={navLink}>Login</Link>
          <Link to="/register" style={navLink}>Cadastro</Link>
          <Link to="/criar-modelos" style={navLink}>Criar Modelo</Link>
          <Link to="/modelos" style={navLink}>Modelos</Link>
          <Link to="/pesquisas" style={navLink}>Pesquisas</Link>
        </nav>
        <div style={gear}>⚙️</div>
      </header>

      <div style={card}>
        <h2 style={title}>SELECIONAR PESQUISA</h2>

        {loading && <p style={{ color: "#fff" }}>⏳ Carregando...</p>}
        {erro && <p style={{ color: "#f66" }}>❌ {erro}</p>}

        <div style={opcoesCol}>
          {!loading && pesquisas.length === 0 && (
            <p style={{ color: "#aaa" }}>📭 Nenhuma pesquisa disponível</p>
          )}

          {pesquisas.map((pesquisa) => {
            const selected = selecionada?.id === pesquisa.id;
            return (
              <button
                key={pesquisa.id}
                onClick={() => handleSelecionar(pesquisa)}
                style={{
                  ...opcaoBtn,
                  background: selected ? "#1ea8ff" : "#d7d7d7",
                  color: selected ? "#fff" : "#1a1a1a",
                  border: selected ? "2px solid #fff" : "2px solid transparent",
                }}
              >
                {pesquisa.titulo || pesquisa.nome || `Pesquisa ${pesquisa.id}`}
              </button>
            );
          })}
        </div>

        <div style={actionsRow}>
          <button
            onClick={() => navigate(-1)}
            style={{ ...navBtn, background: "#f4b7ac" }}
          >
            Voltar
          </button>
          <button
            onClick={handleProximo}
            disabled={!selecionada}
            style={{
              ...navBtn,
              background: "#6ee391",
              opacity: selecionada ? 1 : 0.5,
              cursor: selecionada ? "pointer" : "not-allowed",
            }}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://i.imgur.com/3JpVQcb.png')",
  backgroundSize: "120px 120px",
  backgroundRepeat: "repeat",
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
  position: "sticky",
  top: 0,
  zIndex: 5,
  padding: "0 14px",
  boxSizing: "border-box",
  borderBottom: "2px solid #fff",
};

const brand = {
  fontWeight: 800,
  letterSpacing: 1,
  fontSize: 18,
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const navLinks = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};

const navLink = {
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
};

const gear = {
  marginLeft: "auto",
  fontSize: 18,
  cursor: "pointer",
};

const card = {
  marginTop: 18,
  width: "92%",
  maxWidth: 940,
  background: "#0b0b0b",
  border: "5px solid #1ea8ff",
  borderRadius: 10,
  padding: "18px 16px 24px",
  color: "#fff",
  boxSizing: "border-box",
  textAlign: "center",
};

const title = {
  margin: "0 0 18px 0",
  fontSize: 18,
  fontWeight: 700,
};

const opcoesCol = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "center",
  marginBottom: 16,
  maxHeight: 300,
  overflowY: "auto",
};

const opcaoBtn = {
  width: 280,
  padding: "10px 14px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  transition: "all 0.2s",
};

const actionsRow = {
  display: "flex",
  justifyContent: "center",
  gap: 14,
  marginTop: 6,
};

const navBtn = {
  minWidth: 110,
  padding: "8px 18px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  color: "#1a1a1a",
};