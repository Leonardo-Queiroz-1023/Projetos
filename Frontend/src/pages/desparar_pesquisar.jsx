import React, { useEffect, useState } from "react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeloId]);

  async function carregarModelo() {
    try {
      setErro(null);
      // tenta várias possíveis funções da api para maior compatibilidade
      const fn = api.getModelo || api.getModeloById || api.getModelById;
      if (!fn) {
        // fallback mock
        const mock = {
          id: modeloId || 1,
          nome: `Modelo ${modeloId || 1}`,
          descricao: "Descrição mock",
        };
        setModelo(mock);
        setTitulo(`Pesquisa - ${mock.nome}`);
        return;
      }
      const data = await fn(modeloId);
      // se o backend retornar objeto dentro de data, tenta pegar corretamente
      const m = data?.modelo || data || { id: modeloId, nome: `Modelo ${modeloId}` };
      setModelo(m);
      setTitulo((prev) => (m.nome ? `Pesquisa - ${m.nome}` : prev));
    } catch (e) {
      setErro("Erro ao carregar modelo (usando mock)");
      // mock para permitir teste
      const mock = {
        id: modeloId || 1,
        nome: `Modelo ${modeloId || 1}`,
        descricao: "Descrição mock",
      };
      setModelo(mock);
      setTitulo(`Pesquisa - ${mock.nome}`);
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
        .filter(Boolean);

      if (api.dispararPesquisa) {
        await api.dispararPesquisa({
          modeloId,
          titulo,
          destinatarios: listaEmails,
        });
      } else {
        // mock delay
        await new Promise((r) => setTimeout(r, 700));
      }

      alert("✅ Pesquisa disparada com sucesso!");
      navigate("/pesquisas-em-andamento");
    } catch (err) {
      setErro("Erro ao disparar pesquisa");
    } finally {
      setLoading(false);
    }
  }

  if (!modelo) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 50px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PerimeterBox style={{ padding: 20 }}>⏳ Carregando modelo...</PerimeterBox>
      </div>
    );
  }

  return (
    <div style={container}>
      <PerimeterBox style={{ width: "640px" }}>
        <h1 style={{ marginBottom: 8 }}>📤 Disparar Pesquisa</h1>
        <p style={{ color: "#888", marginTop: 0 }}>
          Modelo: <strong>{modelo.nome}</strong>
        </p>

        <form onSubmit={handleDisparar} style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>Título da pesquisa</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={input}
              required
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={label}>Destinatários (um email por linha)</label>
            <textarea
              value={destinatarios}
              onChange={(e) => setDestinatarios(e.target.value)}
              style={{ ...input, minHeight: 140, fontFamily: "monospace" }}
              placeholder="usuario1@exemplo.com&#10;usuario2@exemplo.com"
              required
            />
          </div>

          {erro && <p style={{ color: "red", marginBottom: 12 }}>❌ {erro}</p>}

          <div style={{ display: "flex", gap: 12 }}>
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
            <button
              type="button"
              onClick={() => navigate("/menu-central")}
              style={{ ...btn, background: "#444" }}
            >
              Menu
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

const label = { display: "block", marginBottom: 8, fontWeight: 600 };
const input = { width: "100%", padding: 12, borderRadius: 8, border: "2px solid #ddd", fontSize: 14, boxSizing: "border-box" };
const btn = { padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: "#000", color: "#fff", fontWeight: 700 };