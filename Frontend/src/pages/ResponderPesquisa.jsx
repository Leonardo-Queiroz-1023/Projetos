import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function ResponderPesquisa() {
  const { token } = useParams();
  const [pesquisa, setPesquisa] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarPesquisa();
  }, [token]);

  async function carregarPesquisa() {
    try {
      const data = await api.getPesquisaPublica(token);
      setPesquisa(data);
    } catch (error) {
      setErro("Pesquisa não encontrada ou expirada");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.enviarResposta(token, respostas);
      setEnviado(true);
    } catch (error) {
      setErro("Erro ao enviar resposta");
    } finally {
      setLoading(false);
    }
  }

  if (erro) {
    return (
      <div style={container}>
        <PerimeterBox style={{ width: "500px", textAlign: "center" }}>
          <h2>❌ {erro}</h2>
        </PerimeterBox>
      </div>
    );
  }

  if (enviado) {
    return (
      <div style={container}>
        <PerimeterBox style={{ width: "500px", textAlign: "center" }}>
          <h1 style={{ color: "green" }}>✅ Resposta enviada!</h1>
          <p style={{ marginTop: 20, color: "#666" }}>
            Obrigado por participar da pesquisa.
          </p>
        </PerimeterBox>
      </div>
    );
  }

  if (!pesquisa) return <p>⏳ Carregando...</p>;

  return (
    <div style={container}>
      <PerimeterBox style={{ width: "600px" }}>
        <h1 style={{ marginBottom: 10 }}>{pesquisa.titulo}</h1>
        <p style={{ color: "#666", marginBottom: 30 }}>
          {pesquisa.descricao}
        </p>

        <form onSubmit={handleSubmit}>
          {pesquisa.perguntas.map((pergunta, idx) => (
            <div key={idx} style={{ marginBottom: 30 }}>
              <label style={label}>
                {idx + 1}. {pergunta.texto}
              </label>

              {pergunta.tipo === "escala" && (
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  {[1, 2, 3, 4, 5].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() =>
                        setRespostas({ ...respostas, [pergunta.id]: valor })
                      }
                      style={{
                        ...escalaBtn,
                        background:
                          respostas[pergunta.id] === valor ? "#000" : "#eee",
                        color:
                          respostas[pergunta.id] === valor ? "#fff" : "#000",
                      }}
                    >
                      {valor}
                    </button>
                  ))}
                </div>
              )}

              {pergunta.tipo === "texto" && (
                <textarea
                  value={respostas[pergunta.id] || ""}
                  onChange={(e) =>
                    setRespostas({ ...respostas, [pergunta.id]: e.target.value })
                  }
                  style={textarea}
                  placeholder="Sua resposta..."
                />
              )}
            </div>
          ))}

          <button type="submit" disabled={loading} style={btn}>
            {loading ? "⏳ Enviando..." : "📤 Enviar Respostas"}
          </button>
        </form>
      </PerimeterBox>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  background: "#f5f5f5",
};

const label = {
  display: "block",
  marginBottom: 12,
  fontWeight: 600,
  fontSize: 16,
};

const escalaBtn = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: "2px solid #ddd",
  cursor: "pointer",
  fontSize: 18,
  fontWeight: 600,
};

const textarea = {
  width: "100%",
  minHeight: 100,
  padding: 12,
  borderRadius: 8,
  border: "2px solid #ddd",
  fontSize: 14,
  boxSizing: "border-box",
  marginTop: 10,
};

const btn = {
  width: "100%",
  padding: "14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#000",
  color: "#fff",
  fontWeight: 600,
  fontSize: 16,
  marginTop: 20,
};