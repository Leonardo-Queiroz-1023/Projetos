// src/pages/CriarModelos.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function CriarModelos() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [plataforma, setPlataforma] = useState("");

    // perguntas adicionadas antes de salvar o modelo
    const [perguntas, setPerguntas] = useState([]);
    const [perguntaAtual, setPerguntaAtual] = useState("");
    const [showPerguntaBox, setShowPerguntaBox] = useState(false);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const adicionarPergunta = () => {
        if (!perguntaAtual.trim()) return;

        const novaPergunta = {
            id: Date.now(), // apenas para controle no front
            texto: perguntaAtual,
        };

        setPerguntas([...perguntas, novaPergunta]);
        setPerguntaAtual("");
        setShowPerguntaBox(false);
    };

    const removerPergunta = (id) => {
        setPerguntas(perguntas.filter((p) => p.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setMessage("");

        try {
            const modeloPayload = {
                nome,
                descricao,
                plataformasDisponiveis: plataforma,
            };

            const result = await api.createModelo(modeloPayload);

            if (perguntas.length > 0 && result.id) {
                for (const p of perguntas) {
                    await api.addPerguntaToModelo(result.id, { questao: p.texto });
                }
            }

            setMessage("✅ Modelo criado com sucesso!");

            setTimeout(() => {
                navigate("/modelos");
            }, 1000);

        } catch (error) {
            console.error("❌ Erro ao criar:", error);
            setMessage("❌ Erro ao criar modelo: " + error.message);


            setLoading(false);
        }
    };
    return (
        <div
            style={{
                minHeight: "calc(100vh - 50px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <PerimeterBox style={{ width: 450 }}>
                <h2 style={{ marginBottom: 20 }}>Criar modelo</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Nome do modelo
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        Descrição
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            style={styles.textarea}
                            rows={3}
                            required
                        />
                    </label>

                    {/* ---- LISTA DE PERGUNTAS ADICIONADAS ---- */}
                    <div style={{ marginTop: 10 }}>
                        <p style={{ marginBottom: 6 }}>Perguntas adicionadas:</p>
                        {perguntas.length === 0 && (
                            <p style={{ fontSize: 13, opacity: 0.6 }}>Nenhuma pergunta ainda.</p>
                        )}

                        {perguntas.map((p) => (
                            <div key={p.id} style={styles.perguntaItem}>
                                <span>{p.texto}</span>
                                <button
                                    type="button"
                                    style={styles.removeBtn}
                                    onClick={() => removerPergunta(p.id)}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            style={styles.addPerguntaBtn}
                            onClick={() => setShowPerguntaBox(true)}
                        >
                            + Adicionar pergunta
                        </button>
                    </div>

                    <button
                        type="submit"
                        // Mescla o estilo base com estilo condicional de disabled
                        style={{
                            ...styles.buttonPrimary,
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        disabled={loading} // Desabilita o clique nativo
                    >
                        {loading ? "Salvando..." : "Salvar modelo"}
                    </button>

                    <button
                        type="button"
                        style={styles.buttonSecondary}
                        onClick={() => navigate("/modelos")}
                        disabled={loading} // Opcional: Bloquear cancelar também
                    >
                        Cancelar
                    </button>
                </form>

                {message && <p style={styles.message}>{message}</p>}

                {/* ------------ MODAL/BOX PARA ADICIONAR PERGUNTA ----------- */}
                {showPerguntaBox && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalBox}>
                            <h3>Adicionar pergunta</h3>

                            <textarea
                                value={perguntaAtual}
                                onChange={(e) => setPerguntaAtual(e.target.value)}
                                style={styles.textarea}
                                placeholder="Digite a pergunta…"
                                rows={3}
                            />

                            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                                <button style={styles.buttonPrimary} onClick={adicionarPergunta}>
                                    Adicionar
                                </button>
                                <button
                                    style={styles.buttonSecondary}
                                    onClick={() => setShowPerguntaBox(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PerimeterBox>
        </div>
    );
}

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },
    label: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    input: {
        padding: 8,
        borderRadius: 6,
        border: "1px solid #555",
        background: "#111",
        color: "#fff",
    },
    textarea: {
        padding: 8,
        borderRadius: 6,
        border: "1px solid #555",
        background: "#111",
        color: "#fff",
    },
    select: {
        padding: 8,
        borderRadius: 6,
        background: "#111",
        color: "#fff",
        border: "1px solid #555",
    },
    perguntaItem: {
        background: "#222",
        padding: "6px 10px",
        borderRadius: 6,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    removeBtn: {
        background: "#b00",
        color: "#fff",
        border: "none",
        padding: "2px 6px",
        borderRadius: 4,
        cursor: "pointer",
    },
    addPerguntaBtn: {
        marginTop: 8,
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px dashed #888",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
    },
    buttonPrimary: {
        padding: 10,
        background: "#000",
        color: "#fff",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
    },
    buttonSecondary: {
        padding: 10,
        background: "#444",
        color: "#fff",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
    },
    message: {
        marginTop: 16,
    },

    // modal para perguntas
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        background: "#222",
        padding: 20,
        borderRadius: 12,
        width: 350,
    },
};
