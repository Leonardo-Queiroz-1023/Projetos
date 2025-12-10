// src/pages/Modelos.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function Modelos() {
  const navigate = useNavigate();
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const logged = localStorage.getItem("logged") === "true";
  useEffect(() => {
        if (!logged) {
            navigate("/login?msg=Faça%20login%20para%20acessar%20o%20menu", { replace: true });
        }
    }, [logged, navigate]);

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
      setErro("Erro ao conectar com o backend");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deletar este modelo?")) return;
    try {
      await api.deleteModelo(id);
      setModelos((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      alert("Erro ao deletar");
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 50px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <PerimeterBox style={{ textAlign: "center", width: "520px" }}>
        <h1 style={{ marginBottom: 20 }}>Modelos</h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 15, justifyContent: "center" }}>
          <button style={btn} onClick={() => navigate("/criar-modelos")}>➕ Criar modelos</button>
          <button style={btn} onClick={carregarModelos} disabled={loading}>
            {loading ? "⏳" : "🔄"} Atualizar
          </button>
          <button style={{ ...btn, background: "#444" }} onClick={() => navigate("/menu-central")}>
             Voltar
          </button>
        </div>

        {erro && <p style={{ color: "red", marginTop: 20 }}>❌ {erro}</p>}

        <div style={{ marginTop: 30, textAlign: "left" }}>
          {modelos.length === 0 ? (
            <p style={{ color: "#666" }}>📭 Nenhum modelo cadastrado.</p>
          ) : (
            modelos.map((modelo) => (
              <div key={modelo.id} style={{ border: "2px solid #000", borderRadius: "8px", padding: "16px", marginBottom: "16px", background: "#fff" }}>
                <h3 style={{ marginBottom: 8 }}>{modelo.nome || "Sem nome"}</h3>
                <p style={{ marginBottom: 10, color: "#555" }}>{modelo.descricao || "Sem descrição"}</p>
                <button style={{ ...btn, width: "100%", background: "#dc3545" }} onClick={() => handleDelete(modelo.id)}>
                  Deletar
                </button>
              </div>
            ))
          )}
        </div>
      </PerimeterBox>
    </div>
  );
}

const btn = {
  width: "200px",
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  background: "#000",
  color: "#fff",
  margin: "0 auto",
};
