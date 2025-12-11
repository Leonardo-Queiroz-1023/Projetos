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
    const [detalheErro, setDetalheErro] = useState("");

    useEffect(() => {
        if (!pesquisaId || !respondenteId) {
            setErro("Link incompleto.");
            setDetalheErro("Os IDs não chegaram na página. Verifique o link no e-mail.");
            setLoading(false);
            return;
        }
        carregarDados();
    }, [pesquisaId, respondenteId]);

    async function carregarDados() {
        try {
            setLoading(true);
            setErro(null);

            const dadosPesquisa = await api.getPesquisaById(pesquisaId);
            setPesquisa(dadosPesquisa);

            if (dadosPesquisa && dadosPesquisa.modeloId) {
                if (!api.getModeloById) throw new Error("Função api.getModeloById não encontrada.");

                const dadosModelo = await api.getModeloById(dadosPesquisa.modeloId);

                const listaPerguntas = dadosModelo.perguntas || (dadosModelo.modelo && dadosModelo.modelo.perguntas) || [];

                if (listaPerguntas.length === 0) {
                    setErro("O modelo desta pesquisa está vazio (sem perguntas).");
                } else {
                    setPerguntas(listaPerguntas);
                }
            } else {
                setErro("Pesquisa sem modelo vinculado.");
            }

        } catch (e) {
            console.error(e);

            let msg = "Erro desconhecido.";
            if (e.response && e.response.status === 404) msg = "Pesquisa ou Modelo não encontrados (404).";
            else if (e.response && e.response.status === 403) msg = "Acesso negado ao Modelo (403).";
            else if (e.message === "Network Error") msg = "Erro de conexão. O Backend (Java) está rodando?";
            else msg = e.message || JSON.stringify(e);

            setErro("Falha ao carregar a pesquisa.");
            setDetalheErro(msg);
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
            alert(`Responda todas as perguntas. Faltam: ${faltantes.length}`);
            return;
        }

        setEnviando(true);
        try {
            await api.enviarRespostas(pesquisaId, respondenteId, respostas);
            setEnviado(true);
        } catch (error) {
            console.error(error);
            // Verifica se é erro de período
            const msgOriginal = error.body?.error || error.message || "Erro ao enviar.";
            let msg = msgOriginal;
            
            if (msgOriginal.toLowerCase().includes("prazo") || msgOriginal.toLowerCase().includes("período") || msgOriginal.toLowerCase().includes("fora")) {
                msg = `Pesquisa fora do período de resposta.\n\nInício: ${pesquisa.dataInicio || "?"}\nFim: ${pesquisa.dataFinal || "?"}.`;
            }
            
            alert("Erro ao enviar: " + msg);
        } finally {
            setEnviando(false);
        }
    }

    if (erro) {
        return (
            <div style={styles.container}>
                <PerimeterBox style={{ padding: 40, textAlign: "center", border: "1px solid red" }}>
                    <h3 style={{color: "#d8000c"}}>❌ Ocorreu um erro</h3>
                    <p style={{fontWeight: "bold", margin: "10px 0"}}>{erro}</p>

                    <div style={{background: "#eee", padding: 15, borderRadius: 5, fontSize: "0.85rem", textAlign: "left", color: "#333"}}>
                        <strong>Diagnóstico Técnico:</strong><br/>
                        {detalheErro}
                    </div>

                    <button onClick={() => window.location.reload()} style={{marginTop: 20, background:"none", border:"none", textDecoration:"underline", cursor:"pointer", color:"#007bff"}}>
                        Tentar novamente
                    </button>
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
                    <p style={{ color: "#666", marginBottom: 30 }}>Suas respostas foram salvas com sucesso.</p>
                </PerimeterBox>
            </div>
        );
    }

    if (loading) return <div style={styles.container}>⏳ Carregando pesquisa...</div>;
    if (perguntas.length === 0) return <div style={styles.container}>Nenhuma pergunta encontrada.</div>;

    const pergunta = perguntas[perguntaAtual];
    const total = perguntas.length;
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
                        {pesquisa.nome} • {perguntaAtual + 1} de {total}
                    </div>

                    <h2 style={{ fontSize: "1.5rem", marginBottom: "30px", color: "#222" }}>
                        {pergunta.texto || pergunta.questao || "Pergunta"}
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

                        {perguntaAtual === total - 1 ? (
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
    footer: { marginTop: 40, paddingTop: 20, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
    navBtn: { background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 14, fontWeight: 600 },
    actionBtn: { background: "#000", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14 },
};