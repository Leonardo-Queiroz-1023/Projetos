import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function ResponderPesquisa() {
    const { pesquisaId, respondenteId } = useParams();

    const [pesquisa, setPesquisa] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [perguntaAtual, setPerguntaAtual] = useState(0);

    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (!pesquisaId || !respondenteId) {
            setErro("Link inválido. Identificação incompleta na URL.");
            setLoading(false);
            return;
        }
        carregarDados();
    }, [pesquisaId, respondenteId]);

    async function carregarDados() {
        try {
            setLoading(true);

            const dadosPesquisa = await api.getPesquisaById(pesquisaId);
            setPesquisa(dadosPesquisa);

            if (dadosPesquisa.modeloId) {
                const dadosModelo = await api.getModeloById(dadosPesquisa.modeloId);

                const listaPerguntas = dadosModelo.perguntas || dadosModelo.modelo?.perguntas || [];
                if (listaPerguntas.length === 0) {
                    setErro("Este modelo não possui perguntas cadastradas.");
                } else {
                    setPerguntas(listaPerguntas);
                }
            } else {
                setErro("Esta pesquisa não possui um modelo vinculado.");
            }

        } catch (e) {
            console.error("Erro ao carregar:", e);
            setErro("Não foi possível carregar a pesquisa. O link pode ter expirado ou você não tem permissão.");
        } finally {
            setLoading(false);
        }
    }

    function handleResposta(perguntaId, valor) {
        setRespostas((prev) => ({
            ...prev,
            [perguntaId]: String(valor),
        }));
    }

    async function handleEnviar() {
        const faltantes = perguntas.filter((p) => !respostas[p.id]);
        if (faltantes.length > 0) {
            alert(`Faltam responder ${faltantes.length} perguntas.`);
            return;
        }

        setEnviando(true);
        try {
            await api.enviarRespostas(pesquisaId, respondenteId, respostas);
            setEnviado(true);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || "Erro desconhecido.";
            alert("Erro ao enviar: " + msg);
        } finally {
            setEnviando(false);
        }
    }

    if (erro) {
        return (
            <div style={styles.container}>
                <PerimeterBox style={{ padding: 40, textAlign: "center", color: "red" }}>
                    <h3>❌ Ocorreu um erro</h3>
                    <p>{erro}</p>
                </PerimeterBox>
            </div>
        );
    }

    if (enviado) {
        return (
            <div style={styles.container}>
                <PerimeterBox style={{ padding: 60, textAlign: "center", maxWidth: "500px" }}>
                    <div style={{ fontSize: "60px", marginBottom: "20px" }}>✅</div>
                    <h2>Respostas Recebidas!</h2>
                    <p style={{ color: "#666" }}>Obrigado por sua participação.</p>
                </PerimeterBox>
            </div>
        );
    }

    if (loading) {
        return <div style={styles.container}>⏳ Carregando pesquisa...</div>;
    }

    if (perguntas.length === 0) {
        return <div style={styles.container}>Nenhuma pergunta encontrada.</div>;
    }

    const pergunta = perguntas[perguntaAtual];
    const total = perguntas.length || 1;
    const progresso = ((perguntaAtual + 1) / total) * 100;
    const respostaAtual = respostas[pergunta.id];

    return (
        <div style={styles.container}>
            <PerimeterBox style={{ width: "100%", maxWidth: "600px", padding: 0, overflow: "hidden" }}>
                <div style={{ width: "100%", height: "6px", background: "#f0f0f0" }}>
                    <div style={{ width: `${progresso}%`, height: "100%", background: "#000", transition: "width 0.3s" }} />
                </div>

                <div style={{ padding: "30px" }}>
                    <div style={{ marginBottom: 20, color: "#888", fontSize: "0.9rem" }}>
                        {pesquisa.nome} • {perguntaAtual + 1} de {perguntas.length}
                    </div>

                    <h2 style={{ fontSize: "1.5rem", marginBottom: "30px", color: "#222" }}>
                        {pergunta.questao || pergunta.texto || "Pergunta sem texto"}
                    </h2>

                    <div style={styles.optionsGrid}>
                        {[1, 2, 3, 4, 5].map((nota) => (
                            <button
                                key={nota}
                                onClick={() => handleResposta(pergunta.id, nota)}
                                style={{
                                    ...styles.optionBtn,
                                    background: respostaAtual === String(nota) ? "#000" : "#fff",
                                    color: respostaAtual === String(nota) ? "#fff" : "#333",
                                    borderColor: respostaAtual === String(nota) ? "#000" : "#ccc",
                                }}
                            >
                                {nota}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 20 }}>
                        <span>Discordo</span>
                        <span>Concordo</span>
                    </div>

                    <div style={styles.footer}>
                        <button
                            onClick={() => setPerguntaAtual((p) => p - 1)}
                            disabled={perguntaAtual === 0}
                            style={{ ...styles.navBtn, visibility: perguntaAtual === 0 ? "hidden" : "visible" }}
                        >
                            ⬅ Anterior
                        </button>

                        {perguntaAtual === perguntas.length - 1 ? (
                            <button onClick={handleEnviar} disabled={enviando} style={styles.actionBtn}>
                                {enviando ? "Enviando..." : "Finalizar 🚀"}
                            </button>
                        ) : (
                            <button onClick={() => setPerguntaAtual((p) => p + 1)} style={styles.actionBtn}>
                                Próxima ➡
                            </button>
                        )}
                    </div>
                </div>
            </PerimeterBox>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", padding: 20, fontFamily: "sans-serif" },
    optionsGrid: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 10 },
    optionBtn: { width: 50, height: 50, borderRadius: "50%", border: "1px solid #ccc", cursor: "pointer", fontSize: 18, fontWeight: "bold", transition: "all 0.2s" },
    footer: { marginTop: 40, paddingTop: 20, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between" },
    navBtn: { background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 14, fontWeight: 600 },
    actionBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14 },
};