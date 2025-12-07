import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ResultadosDetalhe() {
  const navigate = useNavigate();
  const { pesquisaId, perguntaId } = useParams();
  const [respostas, setRespostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarRespostas();
  }, [pesquisaId, perguntaId]);

  async function carregarRespostas() {
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getRespostasPorPergunta(pesquisaId, perguntaId);
      setRespostas(data);
    } catch (error) {
      setErro("Erro ao carregar respostas");
    } finally {
      setLoading(false);
    }
  }

  // Calcular porcentagens
  const total = respostas.reduce((acc, r) => acc + r.quantidade, 0);

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
          <div style={listaRespostas}>
            {respostas.map((resposta, idx) => {
              const porcentagem = total > 0 ? (resposta.quantidade / total) * 100 : 0;
              return (
                <div key={idx} style={respostaRow}>
                  <span style={respostaNumero}>{idx + 1}</span>
                  <span style={respostaTexto}>{resposta.texto}</span>
                  <div style={barraTrack}>
                    <div
                      style={{
                        ...barraFill,
                        width: `${porcentagem}%`,
                        background: getCorPorIndice(idx),
                      }}
                    />
                  </div>
                  <span style={respostaPorcentagem}>{Math.round(porcentagem)}%</span>
                </div>
              );
            })}
          </div>
        )}

        <button style={backBtn} onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
}

function getCorPorIndice(idx) {
  const cores = ["#4CAF50", "#E91E63", "#FFC107", "#2196F3", "#9C27B0"];
  return cores[idx % cores.length];
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

const listaRespostas = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const respostaRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: "#1a1a1a",
  padding: "10px 14px",
  borderRadius: 8,
};

const respostaNumero = {
  width: 24,
  height: 24,
  borderRadius: "50%",
  background: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 700,
};

const respostaTexto = {
  flex: 1,
  fontSize: 14,
  color: "#eee",
};

const barraTrack = {
  width: 150,
  height: 12,
  background: "#333",
  borderRadius: 6,
  overflow: "hidden",
};

const barraFill = {
  height: "100%",
  borderRadius: 6,
  transition: "width 0.4s ease",
};

const respostaPorcentagem = {
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