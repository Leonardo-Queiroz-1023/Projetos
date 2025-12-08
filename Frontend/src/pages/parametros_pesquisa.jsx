import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function ParametrosPesquisa() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarResultados();
  }, [id]);

  async function carregarResultados() {
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getResultadosPesquisa(id);
      setResultados(data?.resultados || []);
    } catch (error) {
      setErro("Erro ao conectar com o backend");
      // MOCK para testar
      setResultados([
        { nota: 5, quantidade: 120 },
        { nota: 4, quantidade: 80 },
        { nota: 3, quantidade: 45 },
        { nota: 2, quantidade: 20 },
        { nota: 1, quantidade: 10 },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const totalAvaliacoes = resultados.reduce((acc, r) => acc + r.quantidade, 0);
  const somaNotas = resultados.reduce((acc, r) => acc + r.nota * r.quantidade, 0);
  const media = totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes).toFixed(1) : 0;

  function renderEstrelas(nota) {
    const cheias = Math.floor(nota);
    const vazias = 5 - cheias;
    return (
      <span style={{ color: "#f5c518", fontSize: 18 }}>
        {"★".repeat(cheias)}{"☆".repeat(vazias)}
      </span>
    );
  }

  function getCorBarra(nota) {
    const cores = { 5: "#4CAF50", 4: "#8BC34A", 3: "#FFC107", 2: "#FF9800", 1: "#f44336" };
    return cores[nota] || "#ccc";
  }

  return (
    <div style={outer}>
      <PerimeterBox style={{ width: "700px", padding: 0 }}>
        <div style={blackCard}>
          <h2 style={title}>RESULTADOS</h2>

          {loading && <p style={{ color: "#fff", textAlign: "center" }}>⏳ Carregando...</p>}
          {erro && <p style={{ color: "#f66", textAlign: "center" }}>⚠️ {erro} (usando mock)</p>}

          <div style={contentRow}>
            <div style={mediaCard}>
              <div style={mediaNumero}>{media}</div>
              <div style={{ marginBottom: 8 }}>{renderEstrelas(parseFloat(media))}</div>
              <div style={mediaTexto}>{totalAvaliacoes} avaliações</div>
            </div>

            <div style={barrasContainer}>
              {[5, 4, 3, 2, 1].map((estrela) => {
                const item = resultados.find((r) => r.nota === estrela) || { quantidade: 0 };
                const porcentagem = totalAvaliacoes > 0 ? (item.quantidade / totalAvaliacoes) * 100 : 0;

                return (
                  <div key={estrela} style={barraRow} onClick={() => navigate(`/resultados-detalhe/${id}/${estrela}`)}>
                    <span style={barraLabel}>{estrela} estrela{estrela > 1 ? "s" : ""}</span>
                    <div style={barraTrack}>
                      <div style={{ ...barraFill, width: `${porcentagem}%`, background: getCorBarra(estrela) }} />
                    </div>
                    <span style={barraPorcentagem}>{Math.round(porcentagem)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button style={backBtn} onClick={() => navigate(-1)}>Voltar</button>
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

const blackCard = { background: "#0b0b0b", borderRadius: 18, padding: 24, color: "#fff" };
const title = { textAlign: "center", margin: "0 0 20px 0", fontSize: 20, fontWeight: 700 };
const contentRow = { display: "flex", gap: 30, justifyContent: "center", flexWrap: "wrap" };
const mediaCard = { textAlign: "center", minWidth: 120 };
const mediaNumero = { fontSize: 48, fontWeight: 700, color: "#fff" };
const mediaTexto = { fontSize: 13, color: "#aaa" };
const barrasContainer = { flex: 1, minWidth: 280, maxWidth: 400 };
const barraRow = { display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer", padding: "4px 8px", borderRadius: 6 };
const barraLabel = { width: 80, fontSize: 13, color: "#ccc" };
const barraTrack = { flex: 1, height: 14, background: "#333", borderRadius: 7, overflow: "hidden" };
const barraFill = { height: "100%", borderRadius: 7, transition: "width 0.4s ease" };
const barraPorcentagem = { width: 40, fontSize: 12, color: "#aaa", textAlign: "right" };
const backBtn = { marginTop: 20, padding: "8px 20px", background: "#f4b7ac", color: "#1a1a1a", border: "none", borderRadius: 6, cursor: "pointer", display: "block", margin: "20px auto 0" };