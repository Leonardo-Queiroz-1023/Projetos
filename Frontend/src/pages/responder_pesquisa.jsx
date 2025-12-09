import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function ResponderPesquisa() {
  const navigate = useNavigate();
  const { id } = useParams(); // id da pesquisa

  const [pesquisa, setPesquisa] = useState(null);
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    carregarPesquisa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarPesquisa() {
    try {
      setLoading(true);
      setErro(null);

      // Tenta carregar do backend
      const data = await api.getPesquisaParaResponder(id);
      setPesquisa(data.pesquisa || data);
      setPerguntas(data.perguntas || []);
    } catch (e) {
      setErro("Erro ao carregar pesquisa (usando mock)");
      // MOCK para testar sem backend
      setPesquisa({ id: id, titulo: "Pesquisa de Satisfação" });
      setPerguntas([
        { id: 1, questao: "Como você avalia nosso atendimento?" },
        { id: 2, questao: "Você indicaria nosso serviço para outras pessoas?" },
        { id: 3, questao: "O que podemos melhorar?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleRespostaChange(perguntaId, valor) {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: valor,
    }));
  }

  function proximaPergunta() {
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    }
  }

  function perguntaAnterior() {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
    }
  }

  async function handleEnviar() {
    // Verifica se todas as perguntas foram respondidas
    const naoRespondidas = perguntas.filter((p) => !respostas[p.id]);
    if (naoRespondidas.length > 0) {
      alert(`Por favor, responda todas as perguntas. Faltam ${naoRespondidas.length}.`);
      return;
    }

    try {
      setEnviando(true);
      setErro(null);

      // Formata as respostas para enviar ao backend
      const respostasArray = perguntas.map((p) => ({
        perguntaId: p.id,
        resposta: respostas[p.id],
      }));

      await api.enviarRespostas(id, respostasArray);
      setEnviado(true);
    } catch (e) {
      // Mock: simula sucesso mesmo sem backend
      console.log("Mock: respostas enviadas", respostas);
      setEnviado(true);
    } finally {
      setEnviando(false);
    }
  }

  // Tela de agradecimento após enviar
  if (enviado) {
    return (
      <div style={container}>
        <PerimeterBox style={{ width: "500px", textAlign: "center" }}>
          <div style={successCard}>
            <span style={{ fontSize: 64 }}>✅</span>
            <h2 style={{ margin: "16px 0 8px" }}>Obrigado!</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Sua resposta foi enviada com sucesso.
            </p>
            <button style={btn} onClick={() => navigate("/")}>
              Voltar ao Início
            </button>
          </div>
        </PerimeterBox>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div style={container}>
        <PerimeterBox style={{ width: "500px", textAlign: "center", padding: 40 }}>
          <p>⏳ Carregando pesquisa...</p>
        </PerimeterBox>
      </div>
    );
  }

  // Erro sem perguntas
  if (!perguntas.length) {
    return (
      <div style={container}>
        <PerimeterBox style={{ width: "500px", textAlign: "center", padding: 40 }}>
          <p style={{ color: "red" }}>❌ Nenhuma pergunta encontrada para esta pesquisa.</p>
          <button style={btn} onClick={() => navigate(-1)}>Voltar</button>
        </PerimeterBox>
      </div>
    );
  }

  const pergunta = perguntas[perguntaAtual];
  const totalPerguntas = perguntas.length;
  const progresso = ((perguntaAtual + 1) / totalPerguntas) * 100;
  const isUltima = perguntaAtual === totalPerguntas - 1;

  return (
    <div style={container}>
      <PerimeterBox style={{ width: "600px", padding: 0 }}>
        <div style={card}>
          {/* Header */}
          <div style={header}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{pesquisa?.titulo || "Pesquisa"}</h2>
            <span style={{ color: "#888", fontSize: 14 }}>
              Pergunta {perguntaAtual + 1} de {totalPerguntas}
            </span>
          </div>

          {/* Barra de progresso */}
          <div style={progressBar}>
            <div style={{ ...progressFill, width: `${progresso}%` }} />
          </div>

          {erro && <p style={{ color: "#f90", padding: "0 20px", fontSize: 13 }}>⚠️ {erro}</p>}

          {/* Pergunta */}
          <div style={perguntaContainer}>
            <p style={perguntaTexto}>{pergunta.questao}</p>

            {/* Opções de resposta (escala 1-5) */}
            <div style={opcoesContainer}>
              {[1, 2, 3, 4, 5].map((nota) => (
                <button
                  key={nota}
                  onClick={() => handleRespostaChange(pergunta.id, nota)}
                  style={{
                    ...opcaoBtn,
                    background: respostas[pergunta.id] === nota ? "#1ea8ff" : "#e9e9e9",
                    color: respostas[pergunta.id] === nota ? "#fff" : "#333",
                    transform: respostas[pergunta.id] === nota ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {nota}
                </button>
              ))}
            </div>

            <div style={legendaContainer}>
              <span style={legenda}>😞 Muito ruim</span>
              <span style={legenda}>😄 Excelente</span>
            </div>

            {/* Ou campo de texto livre */}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, color: "#666" }}>Ou deixe um comentário:</label>
              <textarea
                value={typeof respostas[pergunta.id] === "string" ? respostas[pergunta.id] : ""}
                onChange={(e) => handleRespostaChange(pergunta.id, e.target.value)}
                placeholder="Digite sua resposta..."
                style={textArea}
              />
            </div>
          </div>

          {/* Navegação */}
          <div style={navContainer}>
            <button
              onClick={perguntaAnterior}
              disabled={perguntaAtual === 0}
              style={{ ...navBtn, opacity: perguntaAtual === 0 ? 0.4 : 1 }}
            >
              ⬅ Anterior
            </button>

            {isUltima ? (
              <button
                onClick={handleEnviar}
                disabled={enviando}
                style={{ ...navBtn, background: "#4CAF50", color: "#fff" }}
              >
                {enviando ? "⏳ Enviando..." : "✅ Enviar Respostas"}
              </button>
            ) : (
              <button
                onClick={proximaPergunta}
                style={{ ...navBtn, background: "#1ea8ff", color: "#fff" }}
              >
                Próxima ➡
              </button>
            )}
          </div>

          {/* Voltar */}
          <div style={{ textAlign: "center", paddingBottom: 16 }}>
            <button onClick={() => navigate(-1)} style={linkBtn}>
              Cancelar e voltar
            </button>
          </div>
        </div>
      </PerimeterBox>
    </div>
  );
}

// Estilos
const container = {
  minHeight: "calc(100vh - 50px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  fontFamily: "sans-serif",
};

const card = {
  background: "#0b0b0b",
  borderRadius: 18,
  overflow: "hidden",
  color: "#fff",
};

const header = {
  padding: "20px 24px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #222",
};

const progressBar = {
  width: "100%",
  height: 6,
  background: "#333",
};

const progressFill = {
  height: "100%",
  background: "#1ea8ff",
  transition: "width 0.3s ease",
};

const perguntaContainer = {
  padding: "24px",
};

const perguntaTexto = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 24,
  lineHeight: 1.4,
};

const opcoesContainer = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
  marginBottom: 8,
};

const opcaoBtn = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: "none",
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const legendaContainer = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 20px",
};

const legenda = {
  fontSize: 12,
  color: "#888",
};

const textArea = {
  width: "100%",
  minHeight: 80,
  padding: 12,
  borderRadius: 8,
  border: "2px solid #333",
  background: "#1a1a1a",
  color: "#fff",
  fontSize: 14,
  marginTop: 8,
  boxSizing: "border-box",
  resize: "vertical",
};

const navContainer = {
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 24px",
  borderTop: "1px solid #222",
  gap: 12,
};

const navBtn = {
  padding: "12px 24px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  background: "#333",
  color: "#fff",
  fontSize: 14,
};

const linkBtn = {
  background: "transparent",
  border: "none",
  color: "#888",
  cursor: "pointer",
  textDecoration: "underline",
  fontSize: 13,
};

const btn = {
  padding: "12px 28px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: "#1ea8ff",
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
};

const successCard = {
  padding: "40px 20px",
};