import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function LancarPesquisas() {
  const navigate = useNavigate();
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarModelos();
  }, []);

  async function carregarModelos() {
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getModelos();
      setModelos(data);
    } catch (error) {
      setErro("Erro ao carregar modelos");
    } finally {
      setLoading(false);
    }
  }

  function selecionarModelo(modeloId) {
    navigate(`/disparar-pesquisa/${modeloId}`);
  }

  return (
    <div style={container}>
      <PerimeterBox style={{ width: "600px", textAlign: "center" }}>
        <h1 style={{ marginBottom: 20 }}>🚀 Lançar Pesquisa</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>
          Selecione um modelo para disparar
        </p>

        {loading && <p>⏳ Carregando...</p>}
        {erro && <p style={{ color: "red" }}>❌ {erro}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {modelos.length === 0 && !loading ? (
            <p style={{ color: "#999" }}>📭 Nenhum modelo disponível</p>
          ) : (
            modelos.map((modelo) => (
              <button
                key={modelo.id}
                onClick={() => selecionarModelo(modelo.id)}
                style={modeloCard}
              >
                <h3 style={{ margin: 0, marginBottom: 8 }}>
                  {modelo.nome || "Sem nome"}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
                  {modelo.descricao || "Sem descrição"}
                </p>
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/menu-central")}
          style={{ ...btn, marginTop: 30, background: "#444" }}
        >
          ⬅ Voltar
        </button>
      </PerimeterBox>
    </div>
  );
}

const container = {
  minHeight: "calc(100vh - 50px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modeloCard = {
  width: "100%",
  padding: "20px",
  background: "#f9f9f9",
  border: "2px solid #ddd",
  borderRadius: 12,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.2s",
};

const btn = {
  padding: "12px 24px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#000",
  color: "#fff",
  fontWeight: 600,
};