import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function DispararPesquisa() {
  const navigate = useNavigate();
  const { modeloId } = useParams();
  const [titulo, setTitulo] = useState("Pesquisa de Satisfação");
  const [destinatarios, setDestinatarios] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDisparar(e) {
    e.preventDefault();
    if (!destinatarios.trim()) {
      alert("Adicione ao menos um destinatário!");
      return;
    }

    setLoading(true);
    
    // MOCK: simular disparo
    await new Promise((r) => setTimeout(r, 1000));
    
    alert("✅ Pesquisa disparada com sucesso!");
    navigate("/pesquisas-em-andamento");
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
        <h2 style={title}>📤 Disparar Pesquisa</h2>
        <p style={{ color: "#aaa", textAlign: "center", marginBottom: 20 }}>
          Modelo ID: {modeloId}
        </p>

        <form onSubmit={handleDisparar}>
          <div style={{ marginBottom: 16 }}>
            <label style={label}>Título da pesquisa</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={input}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={label}>Destinatários (um email por linha)</label>
            <textarea
              value={destinatarios}
              onChange={(e) => setDestinatarios(e.target.value)}
              style={{ ...input, minHeight: 120 }}
              placeholder="usuario1@email.com&#10;usuario2@email.com"
              required
            />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button type="button" onClick={() => navigate(-1)} style={{ ...btn, background: "#f4b7ac" }}>
              Voltar
            </button>
            <button type="submit" disabled={loading} style={{ ...btn, background: "#6ee391" }}>
              {loading ? "⏳ Disparando..." : "🚀 Disparar"}
            </button>
          </div>
        </form>
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
  border: "6px solid #000",
  borderRadius: 18,
  padding: 24,
  color: "#fff",
};

const title = { textAlign: "center", margin: "0 0 10px 0", fontSize: 20 };

const label = { display: "block", marginBottom: 8, fontWeight: 600, color: "#ddd" };

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "2px solid #444",
  background: "#1a1a1a",
  color: "#fff",
  fontSize: 14,
  boxSizing: "border-box",
};

const btn = {
  padding: "10px 24px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  color: "#1a1a1a",
};