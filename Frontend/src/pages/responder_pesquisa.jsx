import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResponderPesquisa() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // MOCK: perguntas fake
  const perguntas = [
    { id: 1, texto: "Como você avalia nosso atendimento?", opcoes: ["Muito ruim", "Ruim", "Regular", "Bom", "Excelente"] },
    { id: 2, texto: "Você indicaria nosso serviço?", opcoes: ["Com certeza não", "Provavelmente não", "Talvez", "Provavelmente sim", "Com certeza sim"] },
  ];

  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [enviado, setEnviado] = useState(false);

  const pergunta = perguntas[idx];
  const isLast = idx === perguntas.length - 1;

  function selecionarOpcao(opcao) {
    setRespostas({ ...respostas, [pergunta.id]: opcao });
  }

  function handleNext() {
    if (isLast) {
      setEnviado(true);
    } else {
      setIdx(idx + 1);
    }
  }

  if (enviado) {
    return (
      <div style={page}>
        <div style={card}>
          <h1 style={{ color: "#6ee391", textAlign: "center" }}>✅ Obrigado!</h1>
          <p style={{ textAlign: "center", color: "#aaa" }}>Sua resposta foi enviada com sucesso.</p>
          <button onClick={() => navigate("/")} style={{ ...btn, margin: "20px auto", display: "block" }}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <header style={topBar}>
        <div style={brand}>🧠 SMART SURVEYS</div>
        <nav style={navLinks}>
          <Link to="/" style={navLink}>Página Inicial</Link>
          <Link to="/modelos" style={navLink}>Modelos</Link>
          <Link to="/pesquisas" style={navLink}>Pesquisas</Link>
        </nav>
      </header>

      <div style={card}>
        <h2 style={title}>{idx + 1}. {pergunta.texto}</h2>

        <div style={opcoes}>
          {pergunta.opcoes.map((op, i) => (
            <button
              key={i}
              onClick={() => selecionarOpcao(op)}
              style={{
                ...opcaoBtn,
                background: respostas[pergunta.id] === op ? "#1ea8ff" : "#d7d7d7",
                color: respostas[pergunta.id] === op ? "#fff" : "#1a1a1a",
              }}
            >
              {op}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            style={{ ...btn, background: "#f4b7ac", opacity: idx === 0 ? 0.5 : 1 }}
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            disabled={!respostas[pergunta.id]}
            style={{ ...btn, background: "#6ee391", opacity: respostas[pergunta.id] ? 1 : 0.5 }}
          >
            {isLast ? "Enviar" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://i.imgur.com/3JpVQcb.png')",
  backgroundSize: "120px 120px",
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
  padding: "0 14px",
  borderBottom: "2px solid #fff",
};

const brand = { fontWeight: 800, fontSize: 18 };
const navLinks = { display: "flex", gap: 10 };
const navLink = { color: "#fff", textDecoration: "none", fontSize: 14 };

const card = {
  marginTop: 24,
  width: "90%",
  maxWidth: 600,
  background: "#0b0b0b",
  border: "5px solid #1ea8ff",
  borderRadius: 12,
  padding: 24,
  color: "#fff",
};

const title = { textAlign: "center", margin: "0 0 20px 0", fontSize: 18 };

const opcoes = { display: "flex", flexDirection: "column", gap: 10, alignItems: "center" };

const opcaoBtn = {
  width: 260,
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
};

const btn = {
  padding: "10px 24px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  color: "#1a1a1a",
};