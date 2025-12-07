import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function PesquisasAndamento() {
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
      const data = await api.getPesquisasAndamento(); // GET /pesquisas/andamento
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

  function handleVerDetalhes() {
    if (selecionada) {
      navigate(`/pesquisa-detalhes/${selecionada.id}`);
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
        <h2 style={title}>Em Andamento</h2>

        <div style={contentRow}>
          {/* Área de detalhes da pesquisa selecionada */}
          <div style={detailsArea}>
            {selecionada ? (
              <div style={detailsBox}>
                <h3 style={{ margin: "0 0 12px 0" }}>{selecionada.titulo}</h3>
                <p style={detailItem}>
                  <strong>Criada em:</strong> {new Date(selecionada.criadaEm).toLocaleDateString()}
                </p>
                <p style={detailItem}>
                  <strong>Destinatários:</strong> {selecionada.totalDestinatarios || 0}
                </p>
                <p style={detailItem}>
                  <strong>Respostas:</strong> {selecionada.totalRespostas || 0}
                </p>
                <p style={detailItem}>
                  <strong>Progresso:</strong> {selecionada.progresso || 0}%
                </p>
                <div style={progressBar}>
                  <div
                    style={{
                      ...progressFill,
                      width: `${selecionada.progresso || 0}%`,
                    }}
                  />
                </div>
                <button onClick={handleVerDetalhes} style={detailBtn}>
                  Ver Detalhes
                </button>
              </div>
            ) : (
              <p style={{ color: "#888", textAlign: "center" }}>
                👈 Selecione uma pesquisa para ver os detalhes
              </p>
            )}
          </div>

          {/* Lista de pesquisas */}
          <div style={listBox}>
            {loading && <p style={{ padding: 10 }}>⏳ Carregando...</p>}
            {erro && <p style={{ padding: 10, color: "#c00" }}>❌ {erro}</p>}

            {!loading && pesquisas.length === 0 && (
              <p style={{ padding: 10, color: "#666" }}>📭 Nenhuma pesquisa em andamento</p>
            )}

            {pesquisas.map((p) => {
              const selected = selecionada?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelecionar(p)}
                  style={{
                    ...item,
                    background: selected ? "#1ea8ff" : "transparent",
                    color: selected ? "#fff" : "#000",
                    cursor: "pointer",
                  }}
                >
                  {p.titulo || `Pesquisa ${p.id}`}
                </div>
              );
            })}
          </div>
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
  marginTop: 24,
  width: "90%",
  maxWidth: 940,
  background: "#0b0b0b",
  border: "6px solid #000",
  borderRadius: 18,
  padding: 20,
  color: "#fff",
  boxSizing: "border-box",
};

const title = {
  textAlign: "center",
  margin: "0 0 14px 0",
  fontSize: 18,
};

const contentRow = {
  display: "grid",
  gridTemplateColumns: "1fr 220px",
  gap: 12,
  alignItems: "stretch",
};

const detailsArea = {
  background: "#1a1a1a",
  borderRadius: 8,
  padding: 16,
  minHeight: 260,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const detailsBox = {
  width: "100%",
};

const detailItem = {
  margin: "8px 0",
  fontSize: 14,
  color: "#ccc",
};

const progressBar = {
  width: "100%",
  height: 12,
  background: "#333",
  borderRadius: 6,
  overflow: "hidden",
  marginTop: 12,
};

const progressFill = {
  height: "100%",
  background: "#6ee391",
  transition: "width 0.3s ease",
};

const detailBtn = {
  marginTop: 16,
  padding: "8px 16px",
  background: "#1ea8ff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const listBox = {
  background: "#d7d7d7",
  color: "#000",
  borderRadius: 4,
  padding: "10px 8px",
  overflowY: "auto",
  maxHeight: 360,
  border: "1px solid #bfbfbf",
};

const item = {
  padding: "8px 10px",
  borderBottom: "1px solid #c7c7c7",
  fontSize: 13,
  borderRadius: 4,
  marginBottom: 4,
  transition: "all 0.2s",
};

const backBtn = {
  marginTop: 14,
  padding: "6px 18px",
  background: "#f4b7ac",
  color: "#1a1a1a",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};