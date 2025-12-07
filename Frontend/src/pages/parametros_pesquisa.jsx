import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ParametrosPesquisa() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pesquisa, setPesquisa] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarResultados();
  }, [id]);

  async function carregarResultados() {
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getResultadosPesquisa(id);
      setPesquisa(data.pesquisa);
      setResultados(data.resultados);
    } catch (error) {
      setErro("Erro ao carregar resultados");
    } finally {
      setLoading(false);
    }
  }

  // Calcular média e total de avaliações
  const totalAvaliacoes = resultados.reduce((acc, r) => acc + r.quantidade, 0);
  const somaNotas = resultados.reduce((acc, r) => acc + r.nota * r.quantidade, 0);
  const media = totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes).toFixed(1) : 0;

  // Renderizar estrelas
  function renderEstrelas(nota) {
    const cheias = Math.floor(nota);
    const meia = nota % 1 >= 0.5;
    const vazias = 5 - cheias - (meia ? 1 : 0);
    return (
      <span style={{ color: "#f5c518", fontSize: 18 }}>
        {"★".repeat(cheias)}
        {meia && "½"}
        {"☆".repeat(vazias)}
      </span>
    );
  }

  function handleVerDetalhes(perguntaId) {
    navigate(`/resultados-detalhe/${id}/${perguntaId}`);
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
        <h2 style={title}>RESULTADOS</h2>

        {loading && <p style={{ color: "#fff", textAlign: "center" }}>⏳ Carregando...</p>}
        {erro && <p style={{ color: "#f66", textAlign: "center" }}>❌ {erro}</p>}

        {!loading && !erro && (
          <div style={contentRow}>
            {/* Card de Média Geral */}
            <div style={mediaCard}>
              <div style={mediaNumero}>{media}</div>
              <div style={{ marginBottom: 8 }}>{renderEstrelas(parseFloat(media))}</div>
              <div style={mediaTexto}>{totalAvaliacoes} avaliações</div>
            </div>

            {/* Gráfico de Barras por Estrelas */}
            <div style={barrasContainer}>
              {[5, 4, 3, 2, 1].map((estrela) => {
                const item = resultados.find((r) => r.nota === estrela) || { quantidade: 0 };
                const porcentagem = totalAvaliacoes > 0 
                  ? (item.quantidade / totalAvaliacoes) * 100 
                  : 0;

                return (
                  <div
                    key={estrela}
                    style={barraRow}
                    onClick={() => handleVerDetalhes(estrela)}
                  >
                    <span style={barraLabel}>{estrela} estrela{estrela > 1 ? "s" : ""}</span>
                    <div style={barraTrack}>
                      <div
                        style={{
                          ...barraFill,
                          width: `${porcentagem}%`,
                          background: getCorBarra(estrela),
                        }}
                      />
                    </div>
                    <span style={barraPorcentagem}>{Math.round(porcentagem)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button style={backBtn} onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
}

// Cor da barra baseada na nota
function getCorBarra(nota) {
  const cores = {
    5: "#4CAF50",
    4: "#8BC34A",
    3: "#FFC107",
    2: "#FF9800",
    1: "#f44336",
  };
  return cores[nota] || "#ccc";
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
  maxWidth: 700,
  background: "#0b0b0b",
  border: "6px solid #000",
  borderRadius: 18,
  padding: 24,
  color: "#fff",
  boxSizing: "border-box",
};

const title = {
  textAlign: "center",
  margin: "0 0 20px 0",
  fontSize: 20,
  fontWeight: 700,
};

const contentRow = {
  display: "flex",
  gap: 30,
  alignItems: "flex-start",
  justifyContent: "center",
  flexWrap: "wrap",
};

const mediaCard = {
  textAlign: "center",
  minWidth: 120,
};

const mediaNumero = {
  fontSize: 48,
  fontWeight: 700,
  color: "#fff",
};

const mediaTexto = {
  fontSize: 13,
  color: "#aaa",
};

const barrasContainer = {
  flex: 1,
  minWidth: 280,
  maxWidth: 400,
};

const barraRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: 6,
  transition: "background 0.2s",
};

const barraLabel = {
  width: 80,
  fontSize: 13,
  color: "#ccc",
};

const barraTrack = {
  flex: 1,
  height: 14,
  background: "#333",
  borderRadius: 7,
  overflow: "hidden",
};

const barraFill = {
  height: "100%",
  borderRadius: 7,
  transition: "width 0.4s ease",
};

const barraPorcentagem = {
  width: 40,
  fontSize: 12,
  color: "#aaa",
  textAlign: "right",
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