import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function DispararPesquisa() {
  const navigate = useNavigate();
  const { modeloId } = useParams();
  const [modelo, setModelo] = useState(null);
  const [destinatarios, setDestinatarios] = useState("");
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarModelo();
  }, [modeloId]);

  async function carregarModelo() {
    try {
      const data = await api.getModelo(modeloId);
      setModelo(data);
      setTitulo(`Pesquisa - ${data.nome}`);
    } catch (error) {
      setErro("Erro ao carregar modelo");
    }
  }

  async function handleDisparar(e) {
    e.preventDefault();
    if (!destinatarios.trim()) {
      alert("Adicione ao menos um destinatário");
      return;
    }

    try {
      setLoading(true);
      setErro(null);

      const listaEmails = destinatarios
        .split("\n")
        .map((e) => e.trim())
        .filter((e) => e);

      await api.dispararPesquisa({
        modeloId,
        titulo,
        destinatarios: listaEmails,
      });

      alert("✅ Pesquisa disparada com sucesso!");
      navigate("/pesquisas-em-andamento");
    } catch (error) {
      setErro("Erro ao disparar pesquisa");
    } finally {
      setLoading(false);
    }
  }

  if (!modelo) return <p>⏳ Carregando...</p>;

  return (
    <div style={container}>
      <PerimeterBox style={{ width: "600px" }}>
        <h1 style={{ marginBottom: 10 }}>📤 Disparar Pesquisa</h1>
        <h3 style={{ color: "#666", marginBottom: 30 }}>
          Modelo: {modelo.nome}
        </h3>

        <form onSubmit={handleDisparar}>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Título da pesquisa</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={input}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={label}>
              Destinatários (um email por linha)
            </label>
            <textarea
              value={destinatarios}
              onChange={(e) => setDestinatarios(e.target.value)}
              style={{ ...input, minHeight: 150, fontFamily: "monospace" }}
              placeholder="usuario1@exemplo.com&#10;usuario2@exemplo.com&#10;usuario3@exemplo.com"
              required
            />
          </div>

          {erro && <p style={{ color: "red", marginBottom: 15 }}>❌ {erro}</p>}

          <div style={{ display: "flex", gap: 15 }}>
            <button type="submit" disabled={loading} style={btn}>
              {loading ? "⏳ Disparando..." : "🚀 Disparar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/lancar-pesquisas")}
              style={{ ...btn, background: "#666" }}
            >
              ⬅ Voltar
            </button>
          </div>
        </form>
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

const label = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: 8,
  border: "2px solid #ddd",
  fontSize: 14,
  boxSizing: "border-box",
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