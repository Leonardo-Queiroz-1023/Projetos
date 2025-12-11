import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function LancarPesquisas() {
    const navigate = useNavigate();

    const [pesquisas, setPesquisas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarPesquisas();
    }, []);

    async function carregarPesquisas() {
        try {
            setLoading(false);
            setErro(null);
            const data = await api.getPesquisasTodas();
            setPesquisas(data || []);
        } catch (error) {
            console.error(error);
            setErro("Erro ao conectar com o backend");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: "calc(100vh - 50px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
            <PerimeterBox style={{ textAlign: "center", width: "520px" }}>
                <h1 style={{ marginBottom: 20 }}>🚀 Disparar Pesquisa</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 15, justifyContent: "center" }}>
                    <button style={btn} onClick={carregarPesquisas} disabled={loading}>
                        {loading ? "⏳" : "🔄"} Atualizar
                    </button>
                    <button style={{ ...btn, background: "#444" }} onClick={() => navigate("/menu-central")}>
                        Voltar
                    </button>
                </div>

                {erro && <p style={{ color: "red", marginTop: 20 }}>❌ {erro}</p>}

                <div style={{ marginTop: 30, textAlign: "left" }}>
                    {pesquisas.length === 0 ? (
                        <p style={{ color: "#666" }}>📭 Nenhuma pesquisa encontrada para envio.</p>
                    ) : (
                        pesquisas.map((pesquisa) => (
                            <div 
                                key={pesquisa.id} 
                                style={{ 
                                    border: "2px solid #000", 
                                    borderRadius: "8px", 
                                    padding: "16px", 
                                    marginBottom: "16px", 
                                    background: "#fff" 
                                }}
                            >
                                <h3 style={{ marginBottom: 8 }}>{pesquisa.nome || "Sem nome"}</h3>
                                <p style={{ marginBottom: 10, color: "#555" }}>
                                    Início: {pesquisa.dataInicio ? new Date(pesquisa.dataInicio).toLocaleDateString() : "Sem data"}
                                </p>
                                <button 
                                    style={{ ...btn, width: "100%", background: "#007bff" }} 
                                    onClick={() => navigate(`/disparar-pesquisa/${pesquisa.id}`)}
                                >
                                    Enviar ➔
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