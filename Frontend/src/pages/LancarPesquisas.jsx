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
            // CORREÇÃO AQUI:
            // Mudamos de api.getPesquisas() para api.getPesquisasTodas()
            // para bater com o nome que está no seu api.js
            const data = await api.getPesquisasTodas();

            // O Backend retorna uma lista direta? Ou um objeto com lista?
            // Seu controller retorna: ResponseEntity.ok(resposta) -> Lista direta.
            setPesquisas(data || []);

        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar a lista de pesquisas.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <PerimeterBox style={{ width: "100%", maxWidth: "700px" }}>
                <header style={{ marginBottom: 30, textAlign: "center" }}>
                    <h1 style={{ marginBottom: 10 }}>🚀 Disparar Pesquisa</h1>
                    <p style={{ color: "#666" }}>
                        Selecione uma pesquisa existente abaixo para enviar convites.
                    </p>
                </header>

                {loading && <div style={styles.loading}>⏳ Carregando pesquisas...</div>}

                {erro && <div style={styles.error}>❌ {erro}</div>}

                {!loading && !erro && pesquisas.length === 0 && (
                    <div style={styles.empty}>
                        <p>📭 Nenhuma pesquisa encontrada para envio.</p>
                        {/* Botão opcional para levar para criação de pesquisa se não houver nenhuma */}
                        <button
                            style={styles.btnLink}
                            onClick={() => navigate("/criar-pesquisa")}
                        >
                            Criar uma nova agora?
                        </button>
                    </div>
                )}

                <div style={styles.grid}>
                    {pesquisas.map((pesquisa) => (
                        <div
                            key={pesquisa.id}
                            onClick={() => navigate(`/disparar-pesquisa/${pesquisa.id}`)}
                            style={styles.card}
                            role="button"
                            tabIndex={0}
                        >
                            <div>
                                <h3 style={styles.cardTitle}>{pesquisa.nome}</h3>
                                <p style={styles.cardDesc}>
                                    {/* Seu backend retorna dataInicio e dataFinal */}
                                    Início: {pesquisa.dataInicio ? new Date(pesquisa.dataInicio).toLocaleDateString() : "Sem data"}
                                </p>
                            </div>

                            <div style={styles.cardFooter}>
                                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                                    {/* Exibe o nome do modelo se houver */}
                                    {pesquisa.modeloNome || "Pesquisa Avulsa"}
                                </span>
                                <span style={styles.cardAction}>Enviar ➔</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate("/menu-central")}
                    style={styles.backBtn}
                >
                    ⬅ Voltar ao Menu
                </button>
            </PerimeterBox>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "calc(100vh - 50px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "#f4f4f4",
    },
    loading: { textAlign: "center", padding: 20, fontSize: 18, color: "#555" },
    error: { padding: 15, background: "#ffe6e6", color: "#d8000c", borderRadius: 8, textAlign: "center", marginBottom: 20 },
    empty: { textAlign: "center", padding: 40, color: "#888", background: "#f9f9f9", borderRadius: 8 },
    btnLink: { background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer", marginTop: 10, fontSize: "1rem" },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "15px",
        marginBottom: "30px",
    },
    card: {
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "120px",
    },
    cardTitle: { margin: "0 0 8px 0", fontSize: "1.1rem", color: "#333" },
    cardDesc: { margin: 0, fontSize: "0.9rem", color: "#666", lineHeight: "1.4" },
    cardFooter: { marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "10px" },
    cardAction: { fontSize: "0.85rem", color: "#007bff", fontWeight: "bold" },
    backBtn: {
        background: "transparent",
        border: "1px solid #aaa",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        color: "#555",
        fontWeight: 600,
        display: "block",
        margin: "0 auto",
    }
};