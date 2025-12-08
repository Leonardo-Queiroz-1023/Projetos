import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function PesquisasAndamento() {
  const navigate = useNavigate();
  const [pesquisas, setPesquisas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    carregarPesquisas();
  }, []);

  async function carregarPesquisas() {
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getPesquisasAndamento();
      setPesquisas(data || []);
    } catch (error) {
      setErro("Erro ao conectar com o backend");
      // MOCK para testar sem backend
      setPesquisas([
        { id: 1, titulo: "Pesquisa 1", criadaEm: new Date(), totalDestinatarios: 10, totalRespostas: 5, progresso: 50 },
        { id: 2, titulo: "Pesquisa 2", criadaEm: new Date(), totalDestinatarios: 20, totalRespostas: 8, progresso: 40 },
        { id: 3, titulo: "Pesquisa 3", criadaEm: new Date(), totalDestinatarios: 15, totalRespostas: 15, progresso: 100 },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelecionar(pesquisa) {
    setSelecionada(pesquisa);
  }

  return (
    <div style={outer}>
      <PerimeterBox style={{ width: "800px", padding: 0 }}>
        <div style={blackCard}>
          <h2 style={title}>Em Andamento</h2>

          <div style={contentRow}>
            {/* Área de detalhes */}
            <div style={detailsArea}>
              {selecionada ? (
                <div>
                  <h3 style={{ margin: "0 0 12px 0", color: "#fff" }}>{selecionada.titulo}</h3>
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
                    <div style={{ ...progressFill, width: `${selecionada.progresso || 0}%` }} />
                  </div>
                  <button onClick={() => navigate(`/resultados/${selecionada.id}`)} style={detailBtn}>
                    Ver Resultados
                  </button>
                </div>
              ) : (
                <p style={{ color: "#888", textAlign: "center" }}>
                  👈 Selecione uma pesquisa
                </p>
              )}
            </div>

            {/* Lista de pesquisas */}
            <div style={listBox}>
              {loading && <p style={{ padding: 10 }}>⏳ Carregando...</p>}
              {erro && <p style={{ padding: 10, color: "#c00" }}>⚠️ {erro} (usando mock)</p>}

              {pesquisas.length === 0 && !loading && (
                <p style={{ padding: 10, color: "#666" }}>📭 Nenhuma pesquisa</p>
              )}

              {pesquisas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelecionar(p)}
                  style={{
                    ...item,
                    background: selecionada?.id === p.id ? "#1ea8ff" : "transparent",
                    color: selecionada?.id === p.id ? "#fff" : "#000",
                  }}
                >
                  {p.titulo || `Pesquisa ${p.id}`}
                </div>
              ))}
            </div>
          </div>

          <button style={backBtn} onClick={() => navigate("/menu-central")}>
            Voltar
          </button>
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
  background: "#0b0b0b",
  borderRadius: 18,
  padding: 20,
  color: "#fff",
};

const title = { textAlign: "center", margin: "0 0 14px 0", fontSize: 18 };

const contentRow = {
  display: "grid",
  gridTemplateColumns: "1fr 220px",
  gap: 12,
};

const detailsArea = {
  background: "#1a1a1a",
  borderRadius: 8,
  padding: 16,
  minHeight: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const detailItem = { margin: "8px 0", fontSize: 14, color: "#ccc" };

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
};

const listBox = {
  background: "#d7d7d7",
  borderRadius: 4,
  padding: "10px 8px",
  overflowY: "auto",
  maxHeight: 300,
};

const item = {
  padding: "8px 10px",
  borderBottom: "1px solid #c7c7c7",
  fontSize: 13,
  borderRadius: 4,
  marginBottom: 4,
  cursor: "pointer",
};

const backBtn = {
  marginTop: 14,
  padding: "8px 18px",
  background: "#f4b7ac",
  color: "#1a1a1a",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  display: "block",
  margin: "14px auto 0",
};